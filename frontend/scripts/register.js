// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const student_id = document.getElementById('student_id').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const fullname = document.getElementById('fullname').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            
            // Show loading state
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            
            try {
                const userData = {
                    student_id: student_id,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                    fullname: fullname,
                    phoneNumber: phoneNumber,
                };
                
                console.log('Sending to server:', userData);
                
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log('Registration successful, redirecting to login...');
                    // Show success message
                    alert('Registration successful! Please log in with your credentials.');
                    // Redirect to login page
                    window.location.href = '/login.html';
                } else {
                    throw new Error(data.error || 'Register failed.');
                }
            } catch (error) {
                console.error('Register error:', error);
                showError(error.message || 'An error occurred during register. Please try again.');
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
    
    const form = document.getElementById('registerForm');
    form.appendChild(errorElement);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => errorElement.remove(), 300);
    }, 5000);
}
        
function validateRegisterForm(data) {
    // Check if all required fields are filled
    if (!data.student_id || !data.email || !data.password || !data.confirmPassword || !data.fullname || !data.phoneNumber) {
        alert('Please fill in all required fields');
        return false;
    }
            
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
            
    // Check password strength (minimum 6 characters)
    if (data.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
            
    // Check email format
    if (!isValidEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
            
    return true;
}
        
// Real-time password confirmation validation
document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
            
    function checkPasswordMatch() {
        if (confirmPasswordField.value && passwordField.value !== confirmPasswordField.value) {
            confirmPasswordField.style.borderColor = '#ff4444';
        } else {
            confirmPasswordField.style.borderColor = '#ddd';
        }
    }
            
    passwordField.addEventListener('input', checkPasswordMatch);
    confirmPasswordField.addEventListener('input', checkPasswordMatch);
});
