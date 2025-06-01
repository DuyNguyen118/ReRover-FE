// Forgot Password Modal
const modal = document.getElementById('forgotPasswordModal');
const btn = document.querySelector('.forgot-password');
const closeBtn = document.querySelector('.close-btn');
const resetForm = document.getElementById('forgotPasswordForm');
const resetBtn = document.getElementById('resetPasswordBtn');
const verifyBtn = document.getElementById('verifyCodeBtn');
const updateBtn = document.getElementById('updatePasswordBtn');
const verificationGroup = document.getElementById('verificationCodeGroup');
const newPasswordGroup = document.getElementById('newPasswordGroup');
const resendLink = document.getElementById('resendCode');
        
// Prevent form submission on enter key
resetForm.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (resetBtn.style.display !== 'none') {
            resetForm.dispatchEvent(new Event('submit'));
                } else if (verifyBtn.style.display !== 'none') {
                    verifyBtn.click();
                } else if (updateBtn.style.display !== 'none') {
                    updateBtn.click();
                }
            }
        });
        
// Open modal
btn.onclick = function(e) {
    e.preventDefault();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Reset form state
    resetForm.reset();
    verificationGroup.style.display = 'none';
    newPasswordGroup.style.display = 'none';
    resetBtn.style.display = 'block';
    verifyBtn.style.display = 'none';
    updateBtn.style.display = 'none';
    };
        
// Close modal
closeBtn.onclick = function() {
    closeModal();
};
        
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetForm.reset();
    verificationGroup.style.display = 'none';
    newPasswordGroup.style.display = 'none';
    resetBtn.style.display = 'block';
    verifyBtn.style.display = 'none';
    updateBtn.style.display = 'none';
    }
        
// Close when clicking outside modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});
        
// Handle form submission
resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    resetBtn.disabled = true;
    resetBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        // First check if response is OK
        if (!response.ok) {
            // Try to parse as JSON, if that fails, get text
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send verification code');
            } catch (jsonError) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to send verification code');
            }
        }

        // If we get here, the request was successful
        // Show verification code input
        resetBtn.style.display = 'none';
        verificationGroup.style.display = 'block';
        verifyBtn.style.display = 'block';
        document.getElementById('verificationCode').focus();
        
        // Show success message
        alert('Verification code has been sent to your email. Please check your inbox.');
        
    } catch (error) {
        console.error('Password reset error:', error);
        alert(error.message || 'Failed to send verification code. Please try again.');
    } finally {
        resetBtn.disabled = false;
        resetBtn.textContent = 'Send Verification Code';
    }
});

    // Update verify button handler
    verifyBtn.addEventListener('click', async function() {
    const verifyEmail = document.getElementById('resetEmail').value.trim();
    const code = document.getElementById('verificationCode').value.trim();
    
    if (!code) {
        alert('Please enter the verification code');
        return;
    }
    
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                email: verifyEmail,
                code: code
            })
        });

        // First check if response is OK
        if (!response.ok) {
            // Try to parse as JSON, if that fails, get text
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verification failed');
            } catch (jsonError) {
                const errorText = await response.text();
                throw new Error(errorText || 'Verification failed');
            }
        }

        // If we get here, verification was successful
        // Show the new password fields
        verificationGroup.style.display = 'none';
        newPasswordGroup.style.display = 'block';
        verifyBtn.style.display = 'none';
        updateBtn.style.display = 'block';
        document.getElementById('newPassword').focus();
        
    } catch (error) {
        console.error('Verification error:', error);
        alert(error.message || 'Failed to verify code. Please try again.');
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify Code';
    }
});

    // Update password button handler
    updateBtn.addEventListener('click', async function() {
        const email = document.getElementById('resetEmail').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
    
        if (!newPassword || !confirmPassword) {
            alert('Please enter and confirm your new password');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...';
    
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                email: email,
                newPassword: newPassword
            })
        });

        // First check if response is OK
        if (!response.ok) {
            // Try to parse as JSON, if that fails, get text
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset password');
            } catch (jsonError) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to reset password');
            }
        }

        // If we get here, password was reset successfully
        alert('Your password has been reset successfully. You can now log in with your new password.');
        closeModal();
        
    } catch (error) {
        console.error('Password reset error:', error);
        alert(error.message || 'Failed to reset password. Please try again.');
    } finally {
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Password';
    }
});

    // Resend code handler
    resendLink.addEventListener('click', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();
    
        if (!email) {
            alert('Please enter your email address first');
            return;
        }
    
        // Show loading state
        const originalText = resendLink.textContent;
        resendLink.textContent = 'Sending...';
        resendLink.style.pointerEvents = 'none';
    
        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            // First check if response is OK
            if (!response.ok) {
                // Try to parse as JSON, if that fails, get text
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to resend code');
                } catch (jsonError) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to resend code');
                }
            }

            // If we get here, the code was resent successfully
            alert('A new verification code has been sent to your email.');
        
        } catch (error) {
            console.error('Resend code error:', error);
            alert(error.message || 'Failed to resend code. Please try again.');
        } finally {
            // Reset the resend link after 30 seconds
            setTimeout(() => {
                resendLink.textContent = 'Resend';
                resendLink.style.pointerEvents = 'auto';
            }, 30000);
        }
    });

    // Update the update password handler
    updateBtn.onclick = async function() {
        const email = document.getElementById('resetEmail').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
    
        if (!newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...';
    
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, newPassword }),
                credentials: 'include'  // Include cookies in the request
            });
        
            // Check if we were redirected to login page
            if (response.redirected && response.url.includes('/login')) {
                throw new Error('Session expired. Please try the password reset process again.');
            }
        
            // Rest of the code remains the same...
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned an invalid response. Please try again.');
            }
        
            const data = await response.json();
        
            if (response.ok) {
                alert('Password updated successfully!');
                closeModal();
                window.location.href = 'login.html';
            } else {
                throw new Error(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'An error occurred. Please check your connection and try again.');
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = 'Update Password';
        }
    };

    // Update the resend code handler
    resendLink.onclick = async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();
    
        if (!email) {
            alert('Please enter your email address first');
            return;
        }
    
        const originalText = resendLink.textContent;
        resendLink.textContent = 'Sending...';
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email }),
            credentials: 'include'  // Include cookies in the request
        });
        
        // Check if we were redirected to login page
        if (response.redirected && response.url.includes('/login')) {
            throw new Error('You need to be logged in to perform this action');
        }
        
        // Rest of the code remains the same...
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an invalid response. Please try again.');
        }
        
        const data = await response.json();
        
        if (response.ok) {
            alert('New verification code sent!');
        } else {
            throw new Error(data.message || 'Failed to resend code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'An error occurred. Please check your connection and try again.');
    } finally {
        resendLink.textContent = originalText;
    }
};
