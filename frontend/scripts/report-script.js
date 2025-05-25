// Global variables
let currentReportType = 'lost';
let selectedFile = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Report page loaded successfully');
    
    // Set current date and time
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dateTime').value = localDateTime;
    
    // Initialize form validation
    initializeFormValidation();
});

// Switch between Lost and Found report types
function switchReportType(type) {
    currentReportType = type;
    
    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    // Update form labels and placeholders based on type
    updateFormLabels(type);
    
    console.log('Switched to report type:', type);
}

// Update form labels based on report type
function updateFormLabels(type) {
    const locationLabel = document.querySelector('label[for="location"]');
    const locationInput = document.getElementById('location');
    const descriptionTextarea = document.getElementById('description');
    
    if (type === 'lost') {
        locationLabel.textContent = 'Location Lost';
        locationInput.placeholder = 'Where did you lose the item? (e.g., A1, 612)';
        descriptionTextarea.placeholder = 'Please describe the lost item in detail...';
    } else {
        locationLabel.textContent = 'Location Found';
        locationInput.placeholder = 'Where did you find the item? (e.g., A1, 612)';
        descriptionTextarea.placeholder = 'Please describe the found item in detail...';
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileName = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');
    
    if (file) {
        selectedFile = file;
        fileName.textContent = file.name;
        
        // Show image preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    } else {
        selectedFile = null;
        fileName.textContent = 'No file selected';
        imagePreview.innerHTML = '';
    }
}

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('reportForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ff4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#ddd';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Handle form submission
function handleReportSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    const form = document.getElementById('reportForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showMessage('Please fix the errors above before submitting.', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const reportData = {
        type: currentReportType,
        itemName: formData.get('itemName'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        contactInfo: formData.get('contactInfo'),
        dateTime: formData.get('dateTime'),
        additionalInfo: formData.get('additionalInfo'),
        image: selectedFile
    };
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate API call
    setTimeout(() => {
        showLoadingState(false);
        
        // Show success message
        showMessage(`${currentReportType === 'lost' ? 'Lost' : 'Found'} item report submitted successfully! We'll review your submission and add it to our database.`, 'success');
        
        // Reset form
        form.reset();
        selectedFile = null;
        document.getElementById('fileName').textContent = 'No file selected';
        document.getElementById('imagePreview').innerHTML = '';
        
        // Reset date/time to current
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('dateTime').value = localDateTime;
        
        console.log('Report submitted:', reportData);
    }, 2000);
}

// Show loading state
function showLoadingState(isLoading) {
    const submitBtn = document.querySelector('.submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'flex';
    } else {
        submitBtn.disabled = false;
        submitText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Insert at top of form
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(messageDiv, formContainer.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// Profile button functionality
function toggleProfile() {
    console.log('Profile menu toggled');
    alert('Profile menu would appear here');
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

// Smooth scrolling for anchor links
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