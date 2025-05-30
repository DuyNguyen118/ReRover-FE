// Shared JavaScript functions for header and footer components

// Check if user is logged in
function checkLoginStatus() {
    const user = sessionStorage.getItem('user');
    const isLoggedIn = user && user !== 'null';
    
    console.log('Login status:', isLoggedIn);
    return isLoggedIn;
}

// Profile dropdown functionality
function toggleProfile() {
    const existingDropdown = document.querySelector('.profile-dropdown');
    
    // If dropdown exists, remove it
    if (existingDropdown) {
        existingDropdown.remove();
        document.removeEventListener('click', closeDropdownOnOutsideClick);
        return;
    }
    
    // Check if user is logged in to show appropriate options
    const isLoggedIn = checkLoginStatus();
    
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    
    if (isLoggedIn) {
        // Show logged-in user options
        dropdown.innerHTML = `
            <div class="profile-dropdown-content">
                <a href="user.html" class="profile-option">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Details
                </a>
                <button class="profile-option logout-btn" onclick="logout()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                </button>
            </div>
        `;
    } else {
        // Show login/register options for non-logged-in users
        dropdown.innerHTML = `
            <div class="profile-dropdown-content">
                <a href="login.html" class="profile-option">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10,17 15,12 10,7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Login
                </a>
                <a href="register.html" class="profile-option">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <path d="M20 8v6"></path>
                        <path d="M23 11h-6"></path>
                    </svg>
                    Register
                </a>
            </div>
        `;
    }
    
    // Style the dropdown
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 10px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border: 1px solid #f0f0f0;
        min-width: 160px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        overflow: hidden;
    `;
    
    // Position relative to profile button
    const profileBtn = document.querySelector('.profile-btn');
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions && profileBtn) {
        headerActions.style.position = 'relative';
        headerActions.appendChild(dropdown);
        
        // Animate in
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeDropdownOnOutsideClick);
        }, 100);
        
        console.log('Profile dropdown opened');
    } else {
        console.error('Header elements not found');
    }
}

// Handle logout functionality
async function logout() {
    try {
        // Clear all client-side storage first
        sessionStorage.clear();
        localStorage.clear();

        // Clear all cookies
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const [name] = cookie.split('=');
            // Clear with and without domain
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        }

        // Call server-side logout
        try {
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        } catch (e) {
            console.error('Logout API call failed:', e);
            // Continue with redirect even if API call fails
        }

        // Clear storage again to be safe
        sessionStorage.clear();
        localStorage.clear();

        // Add a small delay to ensure everything is cleared
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect to login with a timestamp to prevent caching
        window.location.href = `/login.html?t=${new Date().getTime()}`;
        
    } catch (error) {
        console.error('Logout error:', error);
        // Final cleanup and redirect
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

// Close dropdown when clicking outside
function closeDropdownOnOutsideClick(event) {
    const dropdown = document.querySelector('.profile-dropdown');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !profileBtn.contains(event.target)) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (dropdown.parentNode) {
                dropdown.remove();
            }
            document.removeEventListener('click', closeDropdownOnOutsideClick);
        }, 300);
    }
}

// Initialize header functionality after it's loaded
function initializeHeader() {
    console.log('Initializing header functionality');
    
    // Add profile dropdown styles
    if (!document.querySelector('#profile-dropdown-styles')) {
        const dropdownStyles = document.createElement('style');
        dropdownStyles.id = 'profile-dropdown-styles';
        dropdownStyles.textContent = `
            .profile-dropdown-content {
                padding: 8px 0;
            }
            
            .profile-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                text-decoration: none;
                color: #000000;
                font-size: 14px;
                font-weight: 500;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Outfit', sans-serif;
            }
            
            .profile-option:hover {
                background: #f8f8f8;
                color: #B9FF66;
            }
            
            .profile-option svg {
                transition: transform 0.2s ease;
            }
            
            .profile-option:hover svg {
                transform: scale(1.1);
            }
            
            .logout-btn:hover {
                background: #fff5f5;
                color: #ff4444;
            }
            
            @media (max-width: 768px) {
                .profile-dropdown {
                    right: -10px;
                    min-width: 140px;
                }
                
                .profile-option {
                    padding: 10px 16px;
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(dropdownStyles);
    }
    
    // Setup report button to require login
    setupReportButton();
    
    // Add keyboard navigation support
    addKeyboardNavigation();
}

// Setup report button to require login
function setupReportButton() {
    const reportBtn = document.querySelector('.report-btn');
    
    if (reportBtn) {
        // Remove any existing event listeners
        const newReportBtn = reportBtn.cloneNode(true);
        reportBtn.parentNode.replaceChild(newReportBtn, reportBtn);
        
        newReportBtn.addEventListener('click', function(e) {
            if (!checkLoginStatus()) {
                e.preventDefault();
                showNotification('Please login to report an item', 'warning');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
            // If logged in, let the normal link behavior work
        });
    }
}

// Newsletter subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail');
    
    if (!email) {
        console.error('Newsletter email input not found');
        return;
    }
    
    const emailValue = email.value.trim();
    
    if (!emailValue) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(emailValue)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    console.log('Newsletter subscription:', emailValue);
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    email.value = '';
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Keyboard navigation support
function addKeyboardNavigation() {
    // Handle Escape key to close any open menus
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const dropdown = document.querySelector('.profile-dropdown');
            if (dropdown) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdownOnOutsideClick);
            }
        }
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        font-family: 'Outfit', sans-serif;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#B9FF66';
            notification.style.color = '#000000';
            break;
        case 'error':
            notification.style.background = '#ff4444';
            break;
        case 'warning':
            notification.style.background = '#ffa500';
            break;
        default:
            notification.style.background = '#292A32';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReRover components loaded successfully');
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // If header/footer are loaded dynamically, wait for them
    const headerElement = document.querySelector('header');
    
    if (headerElement) {
        // Header is already in DOM
        initializeHeader();
    } else {
        // Header will be loaded dynamically, wait for it
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const header = document.querySelector('header');
                    if (header) {
                        initializeHeader();
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Add active class to current page navigation link
    setTimeout(() => {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }, 100);
});

// For testing purposes - simulate login
function simulateLogin() {
    sessionStorage.setItem('userToken', 'demo-token-' + Date.now());
    sessionStorage.setItem('userData', JSON.stringify({
        name: 'Demo User',
        email: 'demo@example.com'
    }));
    console.log('Demo login successful');
    showNotification('Successfully logged in!', 'success');
    // Reload page to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// For testing purposes - simulate logout
function simulateLogout() {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
    console.log('Demo logout successful');
    showNotification('Successfully logged out!', 'success');
    // Reload page to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Make functions globally available
window.toggleProfile = toggleProfile;
window.logout = logout;
window.subscribeNewsletter = subscribeNewsletter;
window.simulateLogin = simulateLogin;
window.simulateLogout = simulateLogout;