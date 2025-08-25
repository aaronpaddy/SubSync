// SubTrackr Content Script - Simple & Effective
class SubSyncDetector {
    constructor() {
        this.isInitialized = false;
        this.fab = null;
        this.dialog = null;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🎯 SubSync: Initializing on', window.location.hostname);
        
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.detectAndShow());
        } else {
            this.detectAndShow();
        }
        
        this.isInitialized = true;
    }

    detectAndShow() {
        const services = this.detectSubscriptionServices();
        
        if (services.length > 0) {
            console.log('✅ SubSync: Found subscription services:', services);
            this.showFloatingActionButton(services);
        } else {
            console.log('ℹ️ SubSync: No subscription services detected on this page');
        }
    }

    detectSubscriptionServices() {
        const pageText = document.body.innerText.toLowerCase();
        const pageHTML = document.body.innerHTML.toLowerCase();
        const url = window.location.hostname.toLowerCase();
        
        // Simple, effective detection with better accuracy
        const services = [
            {
                name: 'Netflix',
                patterns: ['netflix'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'start membership', 'join', 'sign up', 'pricing', 'plans'],
                requiredKeywords: 2,
                domainMatch: ['netflix.com']
            },
            {
                name: 'Spotify',
                patterns: ['spotify'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'premium', 'join', 'sign up', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['spotify.com']
            },
            {
                name: 'Amazon Prime',
                patterns: ['amazon prime', 'prime'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'join prime', 'start prime', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['amazon.com', 'amzn.com']
            },
            {
                name: 'YouTube Premium',
                patterns: ['youtube premium', 'youtube'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'join', 'sign up', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['youtube.com', 'youtu.be']
            },
            {
                name: 'Disney+',
                patterns: ['disney+', 'disney plus'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'start', 'join', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['disneyplus.com', 'disney.com']
            },
            {
                name: 'Hulu',
                patterns: ['hulu'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'start', 'join', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['hulu.com']
            },
            {
                name: 'Apple One',
                patterns: ['apple one'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'start', 'join', 'pricing'],
                requiredKeywords: 2,
                domainMatch: ['apple.com']
            },
            {
                name: 'Verizon',
                patterns: ['verizon'],
                pricePatterns: [/\$(\d+(?:\.\d{2})?)/g],
                keywords: ['subscribe', 'plan', 'pricing', 'wireless'],
                requiredKeywords: 2,
                domainMatch: ['verizon.com', 'verizonwireless.com']
            }
        ];

        const detected = [];
        
        services.forEach(service => {
            // Check if service name matches
            const nameMatch = service.patterns.some(pattern => 
                pageText.includes(pattern) || url.includes(pattern)
            );
            
            // Check domain match (more strict)
            const domainMatch = service.domainMatch.some(domain => 
                url.includes(domain)
            );
            
            // Check for subscription keywords
            const keywordMatch = service.keywords.some(keyword => 
                pageText.includes(keyword)
            );
            
            // Count how many keywords are found
            const keywordCount = service.keywords.filter(keyword => 
                pageText.includes(keyword)
            ).length;
            
            // Check for pricing
            const prices = this.extractPrices(service.pricePatterns);
            
            // More strict matching logic
            if (nameMatch && domainMatch && keywordCount >= service.requiredKeywords && prices.length > 0) {
                detected.push({
                    ...service,
                    prices: prices,
                    confidence: 'high',
                    matchedDomain: url
                });
            }
        });

        return detected;
    }

    extractPrices(pricePatterns) {
        const prices = [];
        pricePatterns.forEach(pattern => {
            const matches = document.body.innerText.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    const price = parseFloat(match.replace('$', ''));
                    if (price > 0 && price < 1000) { // Reasonable price range
                        prices.push(price);
                    }
                });
            }
        });
        return [...new Set(prices)]; // Remove duplicates
    }

    showFloatingActionButton(services) {
        // Remove existing FAB if any
        if (this.fab) {
            this.fab.remove();
        }

        // Create floating action button
        this.fab = document.createElement('div');
        this.fab.className = 'subsync-fab';
        this.fab.innerHTML = `
            <div class="fab-icon">📱</div>
            <div class="fab-text">Track Subscription</div>
        `;
        
        // Position at top right
        this.fab.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            user-select: none;
        `;

        // Hover effects
        this.fab.addEventListener('mouseenter', () => {
            this.fab.style.transform = 'scale(1.05)';
            this.fab.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        this.fab.addEventListener('mouseleave', () => {
            this.fab.style.transform = 'scale(1)';
            this.fab.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        // Click handler
        this.fab.addEventListener('click', () => {
            this.showQuickAddDialog(services);
        });

        document.body.appendChild(this.fab);
        console.log('✅ SubSync: Floating action button added');
    }

    showQuickAddDialog(services) {
        // Remove existing dialog if any
        if (this.dialog) {
            this.dialog.remove();
        }

        // Create dialog
        this.dialog = document.createElement('div');
        this.dialog.className = 'subsync-dialog';
        
        let dialogContent = `
            <div class="dialog-header">
                <h3>Add to SubSync</h3>
                <button class="close-btn" id="closeDialog">×</button>
            </div>
            <div class="dialog-content">
                <p>Found subscription services on this page:</p>
                <div class="services-list">
        `;

        services.forEach(service => {
            const price = service.prices.length > 0 ? `$${service.prices[0]}` : '';
            dialogContent += `
                <div class="service-item" data-service="${service.name}" data-price="${price}">
                    <div class="service-info">
                        <div class="service-name">${service.name}</div>
                        <div class="service-price">${price}</div>
                    </div>
                    <button class="add-btn" data-service="${service.name}" data-price="${price}">
                        Add to SubSync
                    </button>
                </div>
            `;
        });

        dialogContent += `
                </div>
            </div>
        `;

        this.dialog.innerHTML = dialogContent;
        
        // Style the dialog
        this.dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 400px;
            width: 90vw;
            max-height: 80vh;
            overflow: hidden;
        `;

        // Add event listeners
        this.dialog.addEventListener('click', (e) => {
            if (e.target.id === 'closeDialog') {
                this.dialog.remove();
            }
        });

        // Add service buttons
        const addButtons = this.dialog.querySelectorAll('.add-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceName = e.target.dataset.service;
                const price = e.target.dataset.price;
                this.addService(serviceName, price);
            });
        });

        document.body.appendChild(this.dialog);
        console.log('✅ SubSync: Quick add dialog shown');
    }

    async addService(serviceName, price) {
        console.log('🎯 Adding service:', serviceName, 'at', price);
        
        try {
            // Get auth token from storage
            const token = await this.getAuthToken();
            if (!token) {
                console.log('❌ No auth token found, redirecting to login');
                this.redirectToLogin();
                return;
            }

            // Prepare subscription data
            const subscriptionData = {
                name: serviceName,
                amount: price ? parseFloat(price.replace('$', '')) : 0,
                category: 'membership',
                website: window.location.href,
                billingCycle: 'monthly',
                nextBillingDate: new Date().toISOString(),
                isActive: true
            };

            console.log('📤 Sending subscription data:', subscriptionData);

            // Add subscription directly to backend
            const response = await this.addSubscriptionDirectly(subscriptionData, token);
            
            if (response.success) {
                console.log('✅ Subscription added successfully:', response.subscription);
                this.showSuccessMessage(serviceName);
                
                // Close dialog
                if (this.dialog) {
                    this.dialog.remove();
                }
            } else {
                console.log('❌ Failed to add subscription:', response.error);
                this.showErrorMessage(response.error);
            }
        } catch (error) {
            console.log('❌ Error adding subscription:', error);
            this.showErrorMessage(error.message);
        }
    }

    async getAuthToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['authToken'], (result) => {
                resolve(result.authToken);
            });
        });
    }

    async addSubscriptionDirectly(subscriptionData, token) {
        try {
            const response = await fetch('http://localhost:5001/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(subscriptionData)
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, subscription: data };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error || 'Failed to add subscription' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    redirectToLogin() {
        // Open login page in new tab
        chrome.tabs.create({ url: 'http://localhost:3000/login' });
    }

    showSuccessMessage(serviceName) {
        // Create success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = `✅ ${serviceName} added to SubSync!`;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        notification.textContent = `❌ ${message}`;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize when script loads
const detector = new SubSyncDetector();
detector.init();
