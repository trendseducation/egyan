// ==============================================
// UNIVERSAL AUTHENTICATION SCRIPT
// For EGyan Skill Development System
// Include this in ALL protected HTML pages
// ==============================================

// Configuration
const AUTH_CONFIG = {
    LOGIN_PAGE_URL: 'https://trendseducation.github.io/egyan/Branch/login.html',
    HOME_PAGE_URL: 'https://trendseducation.github.io/egyan/Branch/index.html',
    SESSION_TIMEOUT: 120 * 60 * 60 * 1000, // 120 hours in milliseconds
    AUTH_CHECK_INTERVAL: 30000, // Check every 30 seconds
    REDIRECT_DELAY: 3000 // 3 seconds delay for redirect messages
};

// DOM Elements cache
let authButton = null;

// ==============================================
// CORE AUTHENTICATION FUNCTIONS
// ==============================================

/**
 * Initialize authentication system
 */
function initAuth() {
    console.log('🔐 Initializing authentication system...');
    
    // Set up no-cache headers
    preventPageCaching();
    
    // Initialize DOM elements
    initializeDOMElements();
    
    // Check authentication immediately
    checkAndHandleAuthentication();
    
    // Set up continuous monitoring
    setupAuthMonitoring();
    
    // Set up back button prevention
    setupBackButtonPrevention();
    
    console.log('✅ Authentication system initialized');
}

/**
 * Prevent page caching
 */
function preventPageCaching() {
    // Add no-cache meta tags dynamically
    if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
        const meta1 = document.createElement('meta');
        meta1.setAttribute('http-equiv', 'Cache-Control');
        meta1.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(meta1);
        
        const meta2 = document.createElement('meta');
        meta2.setAttribute('http-equiv', 'Pragma');
        meta2.setAttribute('content', 'no-cache');
        document.head.appendChild(meta2);
        
        const meta3 = document.createElement('meta');
        meta3.setAttribute('http-equiv', 'Expires');
        meta3.setAttribute('content', '0');
        document.head.appendChild(meta3);
    }
    
    // Reload page if loaded from cache
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
}

/**
 * Initialize DOM elements
 */
function initializeDOMElements() {
    // Find or create auth button
    authButton = document.getElementById('authButton');
    if (!authButton && document.querySelector('header')) {
        authButton = document.createElement('div');
        authButton.id = 'authButton';
        authButton.style.cssText = 'position: absolute; right: 20px; top: 50%; transform: translateY(-50%);';
        document.querySelector('header').appendChild(authButton);
    }
}

/**
 * Check authentication and handle accordingly
 */
function checkAndHandleAuthentication() {
    const isAuthenticated = checkAuthentication();
    
    if (!isAuthenticated) {
        redirectToLogin();
        return false;
    }
    
    // If authenticated, update UI
    updateAuthUI();
    protectAllLinks();
    
    return true;
}

/**
 * Check if user is authenticated
 */
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    const userRole = localStorage.getItem('userRole');
    
    // If any auth data is missing
    if (!isLoggedIn || !loginTime || !userRole) {
        console.log('❌ No authentication data found');
        return false;
    }
    
    // Check session expiration
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - parseInt(loginTime);
    
    if (sessionAge > AUTH_CONFIG.SESSION_TIMEOUT) {
        console.log('⏰ Session expired');
        clearAuthentication();
        return false;
    }
    
    // Update login time to extend session (activity-based renewal)
    localStorage.setItem('loginTime', currentTime.toString());
    
    console.log('✅ User authenticated');
    return true;
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    // Don't redirect if already on login page
    if (window.location.href.includes(AUTH_CONFIG.LOGIN_PAGE_URL)) {
        return;
    }
    
    // Save current URL for redirect back after login
    if (!window.location.href.includes('login.html')) {
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        console.log('📍 Saved redirect URL:', window.location.href);
    }
    
    // Show redirect message
    showRedirectMessage();
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = AUTH_CONFIG.LOGIN_PAGE_URL;
    }, AUTH_CONFIG.REDIRECT_DELAY);
}

/**
 * Show redirect message
 */
function showRedirectMessage() {
    const mainContent = document.getElementById('mainContent') || document.querySelector('main') || document.body;
    
    const messageHTML = `
        <div class="redirect-message" style="
            text-align: center;
            padding: 3rem 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 4rem auto;
            animation: fadeIn 0.5s ease;
        ">
            <h3 style="color: #4361ee; margin-bottom: 1.5rem;">
                <i class="fas fa-exclamation-circle"></i> Authentication Required
            </h3>
            <p style="color: #666; margin-bottom: 1.5rem; font-size: 1.1rem;">
                You need to be logged in to access this page.
            </p>
            <p style="color: #888; margin-bottom: 2rem;">
                Redirecting to login page...
            </p>
            <div class="spinner" style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4361ee;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                margin: 0 auto;
                animation: spin 1s linear infinite;
            "></div>
            <p style="margin-top: 2rem;">
                <a href="${AUTH_CONFIG.LOGIN_PAGE_URL}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background: #4361ee;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin-top: 1rem;
                ">
                    Click here if not redirected
                </a>
            </p>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Clear existing content and show message
    if (mainContent) {
        mainContent.innerHTML = messageHTML;
    }
}

/**
 * Update authentication UI
 */
function updateAuthUI() {
    if (!authButton) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn === 'true' && userRole) {
        // Show logout button
        authButton.innerHTML = `
            <a href="#" onclick="logoutUser(); return false;" style="
                color: white;
                text-decoration: none;
                padding: 8px 16px;
                border-radius: 6px;
                background-color: rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-sign-out-alt"></i>
                Logout (${userRole})
            </a>
        `;
    } else {
        // Show login button
        authButton.innerHTML = `
            <a href="${AUTH_CONFIG.LOGIN_PAGE_URL}" style="
                color: white;
                text-decoration: none;
                padding: 8px 16px;
                border-radius: 6px;
                background-color: rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-sign-in-alt"></i>
                Login
            </a>
        `;
    }
}

/**
 * Protect all links on the page
 */
function protectAllLinks() {
    // Add click handlers to all links except logout and external links
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if already has onclick or is external/logout link
        if (link.onclick || 
            href === '#' || 
            href.includes('logout') || 
            href.startsWith('http') && !href.includes('trendseducation.github.io/egyan/Branch/')) {
            return;
        }
        
        // Add protection to internal links
        link.addEventListener('click', function(event) {
            if (!checkAuthentication()) {
                event.preventDefault();
                showAccessBlockedMessage();
                return false;
            }
            return true;
        });
    });
}

/**
 * Show access blocked message
 */
function showAccessBlockedMessage() {
    const messageHTML = `
        <div class="access-blocked" style="
            text-align: center;
            padding: 3rem 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 4rem auto;
        ">
            <h3 style="color: #f44336; margin-bottom: 1.5rem;">
                <i class="fas fa-ban"></i> Access Blocked
            </h3>
            <p style="color: #666; margin-bottom: 1.5rem;">
                Your session has expired. Please login again to continue.
            </p>
            <a href="${AUTH_CONFIG.LOGIN_PAGE_URL}" style="
                display: inline-block;
                padding: 12px 24px;
                background: #4361ee;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
            ">
                Go to Login Page
            </a>
        </div>
    `;
    
    const mainContent = document.getElementById('mainContent') || document.querySelector('main') || document.body;
    if (mainContent) {
        mainContent.innerHTML = messageHTML;
    }
}

/**
 * Set up authentication monitoring
 */
function setupAuthMonitoring() {
    // Check auth periodically
    setInterval(() => {
        if (!checkAuthentication()) {
            console.log('🔄 Periodic check failed, redirecting...');
            redirectToLogin();
        }
    }, AUTH_CONFIG.AUTH_CHECK_INTERVAL);
    
    // Check auth when page gains focus
    window.addEventListener('focus', () => {
        if (!checkAuthentication()) {
            console.log('👀 Page focus check failed, redirecting...');
            redirectToLogin();
        }
    });
    
    // Check auth when visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !checkAuthentication()) {
            console.log('👁️ Visibility check failed, redirecting...');
            redirectToLogin();
        }
    });
}

/**
 * Set up back button prevention
 */
function setupBackButtonPrevention() {
    // Prevent going back to protected pages without auth
    history.pushState(null, null, window.location.href);
    
    window.onpopstate = function(event) {
        // Check auth when back button is pressed
        if (!checkAuthentication()) {
            history.pushState(null, null, window.location.href);
            redirectToLogin();
        } else {
            // Still authenticated, keep preventing back
            history.pushState(null, null, window.location.href);
        }
    };
}

/**
 * Logout user
 */
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        clearAuthentication();
        window.location.href = AUTH_CONFIG.LOGIN_PAGE_URL;
    }
}

/**
 * Clear authentication data
 */
function clearAuthentication() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    console.log('🗑️ Authentication cleared');
}

/**
 * Set authentication after successful login
 */
function setAuthentication(role, userData = {}) {
    const loginTime = new Date().getTime();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', loginTime.toString());
    localStorage.setItem('userRole', role);
    
    if (userData && typeof userData === 'object') {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    console.log(`✅ Authentication set for role: ${role}`);
}

/**
 * Get user data
 */
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Get user role
 */
function getUserRole() {
    return localStorage.getItem('userRole');
}

/**
 * Redirect back to original page after login
 */
function redirectToOriginalPage() {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl && !redirectUrl.includes('login.html')) {
        console.log('↩️ Redirecting back to original page:', redirectUrl);
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
    } else {
        // Fallback to home page
        window.location.href = AUTH_CONFIG.HOME_PAGE_URL;
    }
}

// ==============================================
// INITIALIZATION
// ==============================================

// Start authentication system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

// Export functions for global use
window.AuthSystem = {
    checkAuthentication,
    setAuthentication,
    clearAuthentication,
    logoutUser,
    getUserData,
    getUserRole,
    redirectToOriginalPage,
    updateAuthUI
};

console.log('🔐 Authentication script loaded successfully');
