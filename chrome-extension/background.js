// SubSync Background Service Worker
// Handles context menus, notifications, and background tasks

const serverUrl = 'http://localhost:5001';

// Initialize when service worker starts
chrome.runtime.onInstalled.addListener(() => {
    console.log('🚀 SubSync extension installed');
    createContextMenu();
    setupAlarms();
});

// Create context menu for subscription tracking
function createContextMenu() {
    chrome.contextMenus.create({
        id: 'addSubscription',
        title: 'Add to SubSync',
        contexts: ['page']
    });
    
    console.log('✅ SubSync: Context menu created');
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'addSubscription') {
        console.log('🎯 SubSync: Context menu clicked for subscription tracking');
        
        // Get current tab info
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const currentTab = tabs[0];
                console.log('📍 Current tab:', currentTab.url);
                
                // Extract basic info from the page
                const subscriptionData = {
                    name: currentTab.title || 'Unknown Service',
                    amount: 0, // Will be updated by content script
                    category: 'membership',
                    website: currentTab.url,
                    billingCycle: 'monthly',
                    nextBillingDate: new Date().toISOString(),
                    isActive: true,
                    source: 'context_menu'
                };
                
                // Add subscription using context menu
                addSubscriptionFromContextMenu(subscriptionData);
            }
        });
    }
});

// Add subscription from context menu
async function addSubscriptionFromContextMenu(subscriptionData) {
    try {
        // Get auth token
        const result = await chrome.storage.local.get(['authToken']);
        const token = result.authToken;
        
        if (!token) {
            console.log('❌ SubSync: No auth token found for context menu subscription');
            showNotification('Please log in to SubSync first', 'error');
            return;
        }
        
        console.log('📤 SubSync: Adding subscription from context menu:', subscriptionData);
        
        const response = await fetch(`${serverUrl}/api/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(subscriptionData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ SubSync: Context menu subscription added successfully:', result);
            showNotification('Subscription added to SubSync!', 'success');
            updateBadge();
        } else {
            const errorData = await response.json();
            console.error('❌ SubSync: Failed to add context menu subscription:', errorData);
            showNotification(errorData.error || 'Failed to add subscription', 'error');
        }
    } catch (error) {
        console.error('❌ SubSync: Error adding context menu subscription:', error);
        showNotification('Network error - please check your connection', 'error');
    }
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 SubSync: Received message:', request.action);
    
    switch (request.action) {
        case 'test':
            console.log('🧪 SubSync: Background script test received');
            sendResponse({ success: true, message: 'Background script is working!' });
            break;
            
        case 'subscriptionAdded':
            console.log('✅ SubSync: Subscription added, updating badge');
            updateBadge();
            sendResponse({ success: true });
            break;
            
        case 'refreshSubscriptions':
            console.log('🔄 SubSync: Refreshing subscriptions');
            updateBadge();
            sendResponse({ success: true });
            break;
            
        default:
            console.log('❓ SubSync: Unknown action:', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
    }
    
    return true; // Keep message channel open for async response
});

// Update extension badge with subscription count
async function updateBadge() {
    try {
        const result = await chrome.storage.local.get(['authToken']);
        const token = result.authToken;
        
        if (!token) {
            console.log('❌ SubSync: No auth token for badge update');
            chrome.action.setBadgeText({ text: '' });
            return;
        }
        
        const response = await fetch(`${serverUrl}/api/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const subscriptions = await response.json();
            const activeCount = subscriptions.filter(sub => sub.isActive !== false).length;
            
            console.log('📊 SubSync: Active subscriptions count:', activeCount);
            chrome.action.setBadgeText({ text: activeCount.toString() });
            chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
        } else {
            console.log('❌ SubSync: Failed to fetch subscriptions for badge');
            chrome.action.setBadgeText({ text: '' });
        }
    } catch (error) {
        console.error('❌ SubSync: Error updating badge:', error);
        chrome.action.setBadgeText({ text: '' });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationOptions = {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'SubSync',
        message: message
    };
    
    chrome.notifications.create(notificationOptions, (notificationId) => {
        if (chrome.runtime.lastError) {
            console.error('❌ SubSync: Notification error:', chrome.runtime.lastError);
        } else {
            console.log('✅ SubSync: Notification shown:', notificationId);
        }
    });
}

// Setup periodic alarms for background tasks
function setupAlarms() {
    // Check for upcoming renewals every hour
    chrome.alarms.create('checkRenewals', { periodInMinutes: 60 });
    
    // Update badge every 30 minutes
    chrome.alarms.create('updateBadge', { periodInMinutes: 30 });
    
    console.log('✅ SubSync: Alarms set up');
}

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('⏰ SubSync: Alarm triggered:', alarm.name);
    
    switch (alarm.name) {
        case 'checkRenewals':
            checkUpcomingRenewals();
            break;
        case 'updateBadge':
            updateBadge();
            break;
    }
});

// Check for upcoming subscription renewals
async function checkUpcomingRenewals() {
    try {
        const result = await chrome.storage.local.get(['authToken']);
        const token = result.authToken;
        
        if (!token) {
            console.log('❌ SubSync: No auth token for renewal check');
            return;
        }
        
        const response = await fetch(`${serverUrl}/api/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const subscriptions = await response.json();
            const now = new Date();
            const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            
            const upcomingRenewals = subscriptions.filter(sub => {
                if (!sub.isActive || !sub.nextBillingDate) return false;
                
                const renewalDate = new Date(sub.nextBillingDate);
                return renewalDate <= threeDaysFromNow && renewalDate > now;
            });
            
            if (upcomingRenewals.length > 0) {
                console.log('🔔 SubSync: Found upcoming renewals:', upcomingRenewals.length);
                
                upcomingRenewals.forEach(sub => {
                    const renewalDate = new Date(sub.nextBillingDate);
                    const daysUntil = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
                    
                    showNotification(
                        `${sub.name} renews in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
                        'info'
                    );
                });
            }
        }
    } catch (error) {
        console.error('❌ SubSync: Error checking renewals:', error);
    }
}

// Listen for storage changes (when user logs in/out)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.authToken) {
        console.log('🔐 SubSync: Auth token changed, updating badge');
        updateBadge();
    }
});

console.log('✅ SubSync: Background service worker loaded and ready');
