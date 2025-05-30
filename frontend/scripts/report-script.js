// Global variables
let currentReportType = 'lost'; // This will map to database status field
let selectedFile = null;

// Check authentication
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.studentId) {
        showMessage('Please log in to access this page.', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return false;
    }
    return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Report page loaded successfully');
    
    // Check authentication
    if (!checkAuth()) return;
    
    // Set current date and time
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dateTime').value = localDateTime;
    
    // Initialize form validation
    initializeFormValidation();
    
    // Set initial form labels
    updateFormLabels(currentReportType);
    
    // Make sure toggle buttons have correct initial state
    const lostBtn = document.querySelector('.toggle-btn[data-type="lost"]');
    if (lostBtn) {
        lostBtn.classList.add('active');
    }
    
    // Add click event listeners to toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchReportType(type);
        });
    });
});

// Switch between Lost and Found report types
function switchReportType(type) {
    console.log('Switching to report type:', type);
    
    // Update global variable (this maps to database status field)
    currentReportType = type;
    
    // Update toggle buttons - remove active from all, add to selected
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.classList.remove('active');
        
        // Add active class to the clicked button
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });
    
    // Update form labels and placeholders based on type
    updateFormLabels(type);
    
    // Update submit button text
    updateSubmitButton(type);
    
    console.log('Current report type (database status):', currentReportType);
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

// Update submit button text based on report type
function updateSubmitButton(type) {
    const submitText = document.querySelector('.submit-text');
    if (submitText) {
        submitText.textContent = `Submit ${type === 'lost' ? 'Lost' : 'Found'} Item Report`;
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

// Handle form submission with proper database mapping
function handleReportSubmit(event) {
    event.preventDefault();
    
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.studentId) {
        showMessage('Your session has expired. Please log in again.', 'error');
        window.location.href = '/login.html';
        return;
    }
    
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
    
    // Collect form data with proper database mapping
    const formData = new FormData(form);
    const reportData = {
        // Database fields
        status: currentReportType, // Maps to database status field (lost/found)
        item_name: formData.get('itemName'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        contact_email: formData.get('contactInfo'),
        date_time: formData.get('dateTime'),
        additional_info: formData.get('additionalInfo'),
        image_file: selectedFile,
        
        // Metadata
        created_at: new Date().toISOString(),
        user_id: user.studentId  // Use the logged-in user's ID
    };
    
    console.log('Submitting report data:', reportData);
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate API call to backend
    setTimeout(() => {
        showLoadingState(false);
        
        // Show success message
        showMessage(
            `${currentReportType === 'lost' ? 'Lost' : 'Found'} item report submitted successfully! ` +
            `Your report has been added to our database with status: "${currentReportType}".`,
            'success'
        );
        
        // Reset form
        resetForm();
        
        console.log('Report submitted successfully with status:', currentReportType);
    }, 2000);
}

// Form validation functions
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

// Reset form to initial state
function resetForm() {
    const form = document.getElementById('reportForm');
    form.reset();
    
    selectedFile = null;
    document.getElementById('fileName').textContent = 'No file selected';
    document.getElementById('imagePreview').innerHTML = '';
    
    // Reset date/time to current
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dateTime').value = localDateTime;
    
    // Reset to lost type
    currentReportType = 'lost';
    const lostBtn = document.querySelector('.toggle-btn[data-type="lost"]');
    const foundBtn = document.querySelector('.toggle-btn[data-type="found"]');
    
    if (lostBtn && foundBtn) {
        lostBtn.classList.add('active');
        foundBtn.classList.remove('active');
    }
    
    updateFormLabels('lost');
    updateSubmitButton('lost');
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