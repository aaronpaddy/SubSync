// SubSync Chrome Extension Popup
// Handles authentication, subscription management, and dashboard display

class SubSyncPopup {
    constructor() {
        this.user = null;
        this.subscriptions = [];
        this.currentView = 'login';
        this.apiBase = 'http://localhost:5001';
        this.lastApiCall = 0;
        this.minApiInterval = 1000; // 1 second between API calls
        
        this.init();
    }

    init() {
        console.log('🚀 SubSync: Popup initializing...');
        
        // Add event listeners
        this.setupEventListeners();
        
        // Check authentication status
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Form navigation
        const showRegisterLink = document.getElementById('showRegister');
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('register');
            });
        }

        const showLoginLink = document.getElementById('showLogin');
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('login');
            });
        }

        // Dashboard actions
        const addSubscriptionBtn = document.getElementById('addSubscriptionBtn');
        if (addSubscriptionBtn) {
            addSubscriptionBtn.addEventListener('click', () => {
                chrome.tabs.create({ url: 'http://localhost:3000/subscriptions/new' });
            });
        }

        const openDashboardBtn = document.getElementById('openDashboardBtn');
        if (openDashboardBtn) {
            openDashboardBtn.addEventListener('click', () => {
                chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
            });
        }

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.checkAuthStatus();
            });
        }

        // Listen for messages from content script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('📨 SubSync: Popup received message:', request.action);
            
            if (request.action === 'subscriptionAdded') {
                console.log('✅ SubSync: Subscription added, refreshing...');
                this.loadSubscriptions();
                sendResponse({ success: true });
            } else if (request.action === 'refreshSubscriptions') {
                console.log('🔄 SubSync: Refreshing subscriptions...');
                this.loadSubscriptions();
                sendResponse({ success: true });
            }
        });
    }

    async checkAuthStatus() {
        try {
            this.showLoading();
            
            const token = await this.getAuthToken();
            if (!token) {
                console.log('❌ SubSync: No auth token found');
                this.showView('login');
                return;
            }

            console.log('🔍 SubSync: Checking auth status, token exists:', !!token);
            
            // Verify token is valid
            const response = await this.makeApiCall('/api/auth/profile');
            if (response.success) {
                this.user = response.data;
                console.log('✅ SubSync: User profile loaded:', response.data.name);
                
                // Load subscriptions
                await this.loadSubscriptions();
                
                // Show dashboard
                this.showView('dashboard');
            } else {
                console.log('❌ SubSync: Invalid auth token');
                await this.clearAuthToken();
                this.showView('login');
            }
        } catch (error) {
            console.error('❌ SubSync: Auth check error:', error);
            this.showError('Authentication failed. Please try again.');
        }
    }

    async handleLogin() {
        try {
            this.showLoading();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const response = await this.makeApiCall('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (response.success) {
                console.log('✅ SubSync: Login successful');
                await this.storeAuthToken(response.data.token);
                this.user = response.data.user;
                
                // Load subscriptions and show dashboard
                await this.loadSubscriptions();
                this.showView('dashboard');
            } else {
                console.log('❌ SubSync: Login failed:', response.error);
                this.showError(response.error || 'Login failed');
            }
        } catch (error) {
            console.error('❌ SubSync: Login error:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    async handleRegister() {
        try {
            this.showLoading();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            const response = await this.makeApiCall('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            
            if (response.success) {
                console.log('✅ SubSync: Registration successful');
                await this.storeAuthToken(response.data.token);
                this.user = response.data.user;
                
                // Load subscriptions and show dashboard
                await this.loadSubscriptions();
                this.showView('dashboard');
            } else {
                console.log('❌ SubSync: Registration failed:', response.error);
                this.showError(response.error || 'Registration failed');
            }
        } catch (error) {
            console.error('❌ SubSync: Registration error:', error);
            this.showError('Registration failed. Please try again.');
        }
    }

    async loadSubscriptions() {
        try {
            console.log('📥 SubSync: Loading subscriptions...');
            
            const response = await this.makeApiCall('/api/subscriptions');
            if (response.success) {
                this.subscriptions = response.data || [];
                console.log('✅ SubSync: Loaded', this.subscriptions.length, 'subscriptions');
                this.renderDashboardView();
            } else {
                console.log('❌ SubSync: Failed to load subscriptions:', response.error);
                this.subscriptions = [];
            }
        } catch (error) {
            console.error('❌ SubSync: Error loading subscriptions:', error);
            this.subscriptions = [];
        }
    }

    renderDashboardView() {
        const dashboardView = document.getElementById('dashboardView');
        if (!dashboardView) return;
        
        // Update stats
        const activeSubscriptions = this.subscriptions.filter(sub => sub.isActive !== false).length;
        const totalSubscriptions = this.subscriptions.length;
        const monthlySpending = this.subscriptions
            .filter(sub => sub.isActive !== false)
            .reduce((sum, sub) => sum + (sub.amount || 0), 0);
        
        // Update display
        const activeElement = document.getElementById('activeSubscriptions');
        const totalElement = document.getElementById('totalSubscriptions');
        const spendingElement = document.getElementById('monthlySpending');
        
        if (activeElement) activeElement.textContent = activeSubscriptions;
        if (totalElement) totalElement.textContent = totalSubscriptions;
        if (spendingElement) spendingElement.textContent = `$${monthlySpending.toFixed(2)}`;
        
        // Update subscriptions list
        this.renderSubscriptionsList();
        
        console.log('📊 SubSync: Dashboard rendered - Active:', activeSubscriptions, 'Total:', totalSubscriptions, 'Monthly:', monthlySpending);
    }

    renderSubscriptionsList() {
        const subscriptionsList = document.getElementById('subscriptionsList');
        if (!subscriptionsList) return;
        
        const recentSubscriptions = this.subscriptions
            .filter(sub => sub.isActive !== false)
            .slice(0, 3); // Show only 3 most recent
        
        if (recentSubscriptions.length === 0) {
            subscriptionsList.innerHTML = '<p class="no-subscriptions">No active subscriptions</p>';
            return;
        }
        
        const subscriptionsHTML = recentSubscriptions.map(sub => `
            <div class="subscription-item">
                <div class="subscription-name">${sub.name}</div>
                <div class="subscription-details">
                    <span class="subscription-amount">$${sub.amount || 0}</span>
                    <span class="subscription-cycle">${sub.billingCycle || 'monthly'}</span>
                </div>
            </div>
        `).join('');
        
        subscriptionsList.innerHTML = subscriptionsHTML;
    }

    showView(view) {
        this.currentView = view;
        
        // Hide all views
        const views = ['loginForm', 'registerForm', 'dashboardView'];
        views.forEach(v => {
            const element = document.getElementById(v);
            if (element) element.style.display = 'none';
        });
        
        // Show selected view
        const targetView = document.getElementById(view === 'login' ? 'loginForm' : view === 'register' ? 'registerForm' : 'dashboardView');
        if (targetView) targetView.style.display = 'block';
        
        console.log('🔄 SubSync: Switched to view:', view);
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        
        if (loadingState) loadingState.style.display = 'block';
        if (errorState) errorState.style.display = 'none';
    }

    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');
        
        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        if (errorMessage) errorMessage.textContent = message;
    }

    async makeApiCall(endpoint, options = {}) {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastApiCall < this.minApiInterval) {
            await new Promise(resolve => setTimeout(resolve, this.minApiInterval - (now - this.lastApiCall)));
        }
        
        try {
            const token = await this.getAuthToken();
            const url = `${this.apiBase}${endpoint}`;
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                ...options
            };
            
            console.log('📡 SubSync: API call to:', endpoint);
            this.lastApiCall = Date.now();
            
            const response = await fetch(url, config);
            
            if (response.status === 429) {
                // Rate limited, retry after delay
                console.log('⚠️ SubSync: Rate limited, retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.makeApiCall(endpoint, options);
            }
            
            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error || `HTTP ${response.status}` };
            }
        } catch (error) {
            console.error('❌ SubSync: API call error:', error);
            return { success: false, error: error.message };
        }
    }

    async getAuthToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['authToken'], (result) => {
                resolve(result.authToken);
            });
        });
    }

    async storeAuthToken(token) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ authToken: token }, resolve);
        });
    }

    async clearAuthToken() {
        return new Promise((resolve) => {
            chrome.storage.local.remove(['authToken'], resolve);
        });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SubSync: Popup DOM loaded, initializing...');
    new SubSyncPopup();
});
