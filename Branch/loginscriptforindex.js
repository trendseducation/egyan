// Authentication check and redirect script
// Add this to any page that requires authentication

function updateAuthButton() {
    const authButton = document.getElementById('authButton');
    if (!authButton) return; // if element not found, skip

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        // Show Logout button
        authButton.innerHTML = `<a id="logoutBtn">🚪 Logout</a>`;
        
        // Add event listener for logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            logout();
        });
    } else {
        // Show Login link
        authButton.innerHTML = `<a href="login.html">💻 Login</a>`;
    }
}

// Function to check if user is logged in
function checkAuthentication() {
    console.log("Checking authentication...");
    
    // Check if authentication data exists in localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    const userRole = localStorage.getItem('userRole');
    
    console.log("Auth data:", { isLoggedIn, loginTime, userRole });
    
    // If not logged in, save the current URL and redirect to login page
    if (!isLoggedIn || !loginTime || !userRole) {
        console.log("Not authenticated, saving current URL and redirecting to login...");
        
        // Save the current URL for redirecting back after login
        // Only save if we're not already on the login page
        if (!window.location.href.includes('https://trendseducation.github.io/egyan/Branch/login.html')) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            console.log("Saved redirect URL:", window.location.href);
        }
        
       /* window.location.href = 'https://trendseducation.github.io/egyan/Branch/login.html';
        return false;  */
    }
    
    // Check if session is expired (24 hours)
    const currentTime = new Date().getTime();
    const sessionDuration = 120 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (currentTime - parseInt(loginTime) > sessionDuration) {
        // Session expired, clear storage and redirect
        console.log("Session expired, redirecting to login...");
        clearAuthentication();
        window.location.href = 'https://trendseducation.github.io/egyan/Branch/login.html';
        return false;
    }
    
    // Update login time to extend session
    localStorage.setItem('loginTime', currentTime.toString());
    
    console.log("User is authenticated");
    return true;
}

// Function to set authentication data after successful login
function setAuthentication(role, userData = {}) {
    const loginTime = new Date().getTime();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', loginTime.toString());
    localStorage.setItem('userRole', role);
    
    // Store additional user data if provided
    if (userData && typeof userData === 'object') {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    console.log("Authentication set for:", role);
}

// Function to clear authentication data
function clearAuthentication() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    console.log("Authentication cleared");
}

// Function to redirect back to the original page after login
function redirectToOriginalPage() {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    if (redirectUrl && !redirectUrl.includes('https://trendseducation.github.io/egyan/Branch/login.html')) {
        console.log("Redirecting back to original page:", redirectUrl);
        sessionStorage.removeItem('redirectAfterLogin'); // Clean up
        window.location.href = redirectUrl;
    } else {
        // Fallback to a default page if no redirect URL is found
        window.location.href = 'index.html';
    }
}

// Function to get user data
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Function to get user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Function to logout user
function logout() {
    console.log("Logging out...");
    clearAuthentication();
    window.location.href = 'https://trendseducation.github.io/egyan/Branch/login.html';
}

// Check authentication on page load
console.log("Authentication script loaded");

// Don't check authentication on login page itself
if (!window.location.pathname.endsWith('https://trendseducation.github.io/egyan/Branch/login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM loaded, checking authentication");
        checkAuthentication();
    });
}
