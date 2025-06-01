const API_BASE_URL = 'http://localhost:8080/api/';

// Global variables
let currentReportType = 'lost';
let selectedFile = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Report page loaded successfully');
            
    // Load header and footer components
    loadComponents();
            
    // Set current date and time
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dateTime').value = localDateTime;
            
    // Add event listeners to toggle buttons
    const lostBtn = document.getElementById('lostBtn');
    const foundBtn = document.getElementById('foundBtn');
            
    lostBtn.addEventListener('click', function() {
        console.log('Lost button clicked');
        switchReportType('lost');
    });
            
    foundBtn.addEventListener('click', function() {
        console.log('Found button clicked');
        switchReportType('found');
    });
            
    // Initialize form validation
    initializeFormValidation();
            
    // Initialize with lost type
    switchReportType('lost');
});

// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header').innerHTML = headerHtml;
                
        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer').innerHTML = footerHtml;
                
        console.log('Components loaded successfully');
                
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Switch between Lost and Found report types
function switchReportType(type) {
    console.log('Switching to type:', type);
            
    // Update global variable
    currentReportType = type;
            
    // Get elements
    const lostBtn = document.getElementById('lostBtn');
    const foundBtn = document.getElementById('foundBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const locationLabel = document.getElementById('locationLabel');
    const locationInput = document.getElementById('location');
    const descriptionInput = document.getElementById('description');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
            
    // Remove active class from both buttons
    lostBtn.classList.remove('active');
    foundBtn.classList.remove('active');
            
    // Add active class to selected button and update UI
    if (type === 'lost') {
        lostBtn.classList.add('active');
        statusIndicator.className = 'status-indicator lost';
        statusIndicator.innerHTML = '📍 Currently reporting: <strong>LOST ITEM</strong>';
        locationLabel.textContent = 'Location Lost';
        locationInput.placeholder = 'Where did you lose the item? (e.g., A1, 612)';
        descriptionInput.placeholder = 'Please describe the lost item in detail...';
        if (submitText) submitText.textContent = 'Submit Lost Report';
    } else {
        foundBtn.classList.add('active');
        statusIndicator.className = 'status-indicator found';
        statusIndicator.innerHTML = '📍 Currently reporting: <strong>FOUND ITEM</strong>';
        locationLabel.textContent = 'Location Found';
        locationInput.placeholder = 'Where did you find the item? (e.g., A1, 612)';
        descriptionInput.placeholder = 'Please describe the found item in detail...';
        if (submitText) submitText.textContent = 'Submit Found Report';
    }
            
    console.log('Switched to:', type);
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
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 10px; border: 2px solid #ddd;">`;
                };
                reader.readAsDataURL(file);
            }
            } else {
                selectedFile = null;
                fileName.textContent = 'No file selected';
                imagePreview.innerHTML = '';
            }
        }

// Handle form submission
function handleReportSubmit(event) {
    event.preventDefault();
            
    // Check if user is authenticated
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.studentId) {
        showMessage('Please log in to submit a report.', 'error');
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
        status: currentReportType,
        item_name: formData.get('itemName'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        contact_email: formData.get('contactInfo'),
        date_time: formData.get('dateTime'),
        additional_info: formData.get('additionalInfo'),
        image_file: selectedFile,
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
    switchReportType('lost');
}

// Show loading state
function showLoadingState(isLoading) {
    const submitBtn = document.querySelector('.submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
            
    if (isLoading) {
        submitBtn.disabled = true;
        if (submitText) submitText.style.display = 'none';
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
    } else {
        submitBtn.disabled = false;
        if (submitText) submitText.style.display = 'block';
        if (loadingSpinner) loadingSpinner.style.display = 'none';
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

async function submitReport(event) {
    event.preventDefault();
    
    try {
        showLoadingState(true);
        
        // Get the current user
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.id) {
            showMessage('Please log in to submit a report.', 'error');
            window.location.href = '/login.html';
            return;
        }

        // Get form data
        const form = document.getElementById('reportForm');
        const formData = new FormData(form);
        
        // Create report data object with correct field names
        const reportData = {
            title: formData.get('itemName'),
            description: formData.get('description'),
            location: formData.get('location'),
            lostDate: formData.get('dateTime'),
            imageUrl: null,
            userId: user.id
        };

        console.log('Submitting report data:', reportData);

        // Handle file upload if present
        const fileInput = document.getElementById('itemImage');
        if (fileInput.files.length > 0) {
            const fileFormData = new FormData();
            fileFormData.append('file', fileInput.files[0]);
            
            try {
                console.log('Uploading file...');
                const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: fileFormData,
                    credentials: 'include'
                });
                
                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    console.error('Upload error:', errorText);
                    throw new Error('Failed to upload image');
                }
                
                const fileData = await uploadResponse.json();
                console.log('File upload successful:', fileData);
                reportData.imageUrl = fileData.fileUrl || fileData.url;
            } catch (error) {
                console.error('Error uploading file:', error);
                // Continue without the image if upload fails
            }
        }

        // Determine the endpoint based on report type
        const endpoint = currentReportType === 'lost' ? 'lost-item' : 'found-item';
        
        console.log('Sending to endpoint:', `${API_BASE_URL}${endpoint}`);
        
        // Send the report data
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(reportData),
            credentials: 'include'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error('Failed to submit report: ' + errorText);
        }

        const responseData = await response.json();
        console.log('Server response data:', responseData);
        
        showMessage('Report submitted successfully!', 'success');
        resetForm();
        
        // Redirect to the appropriate page after successful submission
        setTimeout(() => {
            window.location.href = '/report.html'; // or '/found.html' based on report type
        }, 1500);
        
    } catch (error) {
        console.error('Error in submitReport:', error);
        showMessage(error.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
        showLoadingState(false);
    }
}

// Add event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }
});