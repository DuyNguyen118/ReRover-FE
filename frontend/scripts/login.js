// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const studentId = document.getElementById('student_id').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Show loading state
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            
            try {
                const formData = new FormData();
                formData.append('username', studentId);
                formData.append('password', password);
                
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'  // Important for sessions
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Get user data after successful login
                    const userResponse = await fetch('http://localhost:8080/api/auth/user', {
                        credentials: 'include'
                    });
                    
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('Login successful, redirecting to home...');
                        window.location.href = '/home.html';
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } else {
                    throw new Error(data.error || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message || 'An error occurred during login. Please try again.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});


// Helper function to show error messages
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ff4444';
    errorElement.style.marginTop = '10px';
    errorElement.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.appendChild(errorElement);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => errorElement.remove(), 300);
    }, 5000);
}

// Check authentication status on page load
async function checkAuth() {
    const isAuth = await isAuthenticated();
    const currentPath = window.location.pathname;
    
    if (isAuth && (currentPath.endsWith('login.html') || currentPath.endsWith('register.html'))) {
        window.location.href = '/home.html';
    } else if (!isAuth && !currentPath.endsWith('login.html') && !currentPath.endsWith('register.html')) {
        window.location.href = '/login.html';
    }
}

// Run auth check when the page loads
checkAuth();

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// To check if user is logged in
// Check if user is authenticated
async function isAuthenticated() {
    try {
        const response = await fetch('http://localhost:8080/api/auth/user', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
}

// Logout function
async function logout() {
    try {
        await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}


// Newsletter subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing to our newsletter!');
    document.getElementById('newsletterEmail').value = '';
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Profile button toggle
function toggleProfile() {
    console.log('Profile menu toggled');
    // In a real app, this would show/hide a dropdown menu
    alert('Profile menu would appear here');
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
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
});

// Add form field focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
        e.target.click();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReRover Login Page loaded successfully');
    
    // Add any initialization code here
    initializeAnimations();
});

// Initialize animations and effects
function initializeAnimations() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
}