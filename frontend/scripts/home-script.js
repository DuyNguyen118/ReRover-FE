// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const toggle = item.querySelector('.faq-toggle');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-toggle').textContent = '+';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                toggle.textContent = '−';
            }
        });
    });
});

// Search functionality
async function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        // If search is empty, reload all items
        renderFoundItems();
        renderLostItems();
        return;
    }

    console.log('Searching for:', searchTerm);
    
    try {
        // Fetch both lost and found items
        const [foundItems, lostItems] = await Promise.all([
            fetchFoundItems(),
            fetchLostItems()
        ]);

        // Filter found items
        const filteredFoundItems = foundItems.filter(item => 
            (item.title && item.title.toLowerCase().includes(searchTerm))
        );

        // Filter lost items
        const filteredLostItems = lostItems.filter(item => 
            (item.title && item.title.toLowerCase().includes(searchTerm))
        );

        // Render filtered items
        renderFoundItems(filteredFoundItems);
        renderLostItems(filteredLostItems);

    } catch (error) {
        console.error('Search error:', error);
        alert('Error performing search. Please try again.');
    }
}

// Add search event listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

// Item card interactions
document.addEventListener('DOMContentLoaded', function() {
    const viewDetailBtns = document.querySelectorAll('.view-detail-btn');
    const claimBtns = document.querySelectorAll('.claim-btn');
    
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('View detail functionality would open here');
        });
    });
    
    claimBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemCard = this.closest('.item-card');
            const itemId = itemCard.dataset.id;
            const itemName = itemCard.querySelector('.item-name').textContent;
            
            // Set the item name in the modal
            const modalTitle = document.querySelector('#claimModal h2');
            if (modalTitle) {
                modalTitle.textContent = `Claim: ${itemName}`;
            }
            
            // Store the item ID in the form for submission
            const claimForm = document.getElementById('claimForm');
            if (claimForm) {
                claimForm.dataset.itemId = itemId;
            }
            
            // Show the modal
            const modal = document.getElementById('claimModal');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

// Category dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const categorySelects = document.querySelectorAll('.category-select');
    
    categorySelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedCategory = this.value;
            console.log('Category changed to:', selectedCategory);
            // In a real app, this would filter items by category
        });
    });
});

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

// Add loading animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-grid, .announcements-section, .faqs-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReRover Home Page loaded successfully');
    
    // Set first FAQ as active by default
    const firstFaq = document.querySelector('.faq-item[data-faq="1"]');
    if (firstFaq) {
        firstFaq.classList.add('active');
        firstFaq.querySelector('.faq-toggle').textContent = '−';
    }
});

// Function to fetch found items from the API
async function fetchFoundItems() {
    try {
        const url = `${API_BASE_URL}/found-item`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // Enable CORS
            credentials: 'include', // Include cookies if needed
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error in fetchFoundItems:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Function to create item card HTML for found items
function createFoundItemCard(item) {
    // Construct the full image URL if imageUrl exists
    const imageUrl = item.imageUrl 
        ? `${API_BASE_URL}/found-item/files/${encodeURIComponent(item.imageUrl)}`
        : 'images/placeholder.jpg';

    return `
        <div class="item-card" data-id="${item.id}" data-item-id="${item.id}" data-item-type="found">
            <img src="${imageUrl}" alt="${item.title || 'Found item'}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">${item.title || 'Unnamed Item'}</h3>
                <p class="item-location">Location: ${item.location || 'Not specified'}</p>
                <p class="item-category">Category: ${item.category || 'Not specified'}</p>
                <p class="item-date">Found on: ${formatDate(item.foundDate) || 'Unknown date'}</p>
                <div class="item-actions">
                    <button class="view-detail-btn">View Details</button>
                    <button class="claim-btn">Claim</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render found items in the UI
async function renderFoundItems(items = null, type = null) {
    const container = document.querySelector('.found-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    // Show loading state only if we're fetching new data
    if (items === null) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading found items...</p>
            </div>`;
    }

    try {
        // If items are not provided, fetch them
        if (items === null) {
            items = type ? await fetchFoundItems(type) : await fetchFoundItems();

            // Sort by date and get the 2 most recent items when not searching
            if (!type) {
                items = items
                    .sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate))
                    .slice(0, 2);
            }
        }

        if (!Array.isArray(items)) {
            throw new Error('Invalid response from server');
        }
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <p>No items found${type ? ` in category: ${type}` : ''}.</p>
                    <button onclick="renderFoundItems(null, ${type ? `'${type}'` : 'null'})">Refresh</button>
                </div>`;
            return;
        }

        // Don't limit to 2 items when searching
        container.innerHTML = items.map(createFoundItemCard).join('');
    } catch (error) {
        console.error('Error in renderFoundItems:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load items. Please try again later.</p>
                <p><small>${error.message || 'Unknown error occurred'}</small></p>
                <button onclick="renderFoundItems(null, ${type ? `'${type}'` : 'null'})">Try Again</button>
            </div>`;
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page initialized');
    
    // Load and render found items
    renderFoundItems();
    renderLostItems();
});

// Function to fetch lost items from the API
async function fetchLostItems() {
    try {
        const url = `${API_BASE_URL}/lost-item`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // Enable CORS
            credentials: 'include', // Include cookies if needed
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error in fetchLostItems:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Function to create item card HTML for lost items
function createLostItemCard(item) {
    // Construct the full image URL if imageUrl exists
    const imageUrl = item.imageUrl 
        ? `${API_BASE_URL}/lost-item/files/${encodeURIComponent(item.imageUrl)}`
        : 'images/placeholder.jpg';

    return `
        <div class="item-card" data-id="${item.id}" data-item-id="${item.id}" data-item-type="lost">
            <img src="${imageUrl}" alt="${item.title || 'Lost item'}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">${item.title || 'Unnamed Item'}</h3>
                <p class="item-location">Location: ${item.location || 'Not specified'}</p>
                <p class="item-category">Category: ${item.category || 'Not specified'}</p>
                <p class="item-date">Lost on: ${formatDate(item.lostDate) || 'Unknown date'}</p>
                <div class="item-actions">
                    <button class="view-detail-btn">View Details</button>
                    <button class="claim-btn">Claim</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render lost items in the UI
async function renderLostItems(items = null, type = null) {
    const container = document.querySelector('.lost-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    // Show loading state only if we're fetching new data
    if (items === null) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading lost items...</p>
            </div>`;
    }

    try {
        // If items are not provided, fetch them
        if (items === null) {
            items = type ? await fetchLostItems(type) : await fetchLostItems();

            // Sort by date and get the 2 most recent items when not searching
            if (!type) {
                items = items
                    .sort((a, b) => new Date(b.lostDate) - new Date(a.lostDate))
                    .slice(0, 2);
            }
        }

        if (!Array.isArray(items)) {
            throw new Error('Invalid response from server');
        }
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <p>No items found${type ? ` in category: ${type}` : ''}.</p>
                    <button onclick="renderLostItems(null, ${type ? `'${type}'` : 'null'})">Refresh</button>
                </div>`;
            return;
        }

        // Don't limit to 2 items when searching
        container.innerHTML = items.map(createLostItemCard).join('');
    } catch (error) {
        console.error('Error in renderLostItems:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load items. Please try again later.</p>
                <p><small>${error.message || 'Unknown error occurred'}</small></p>
                <button onclick="renderLostItems(null, ${type ? `'${type}'` : 'null'})">Try Again</button>
            </div>`;
    }
}

// Consolidated item handlers for both lost and found items
// Add this at the top of your home-script.js
class ItemModalHandler {
    constructor() {
        this.claimModal = null;
        this.claimForm = null;
        this.closeClaimModal = null;
        this.userPostsList = null;
        this.selectedPostInput = null;
        this.currentItemId = null;
        this.currentItemType = null;
        this.selectedPostId = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.claimModal = document.getElementById('claimModal');
            this.claimForm = document.getElementById('claimForm');
            this.closeClaimModal = document.querySelector('.close-claim-modal');
            this.userPostsList = document.getElementById('userPostsList');
            this.selectedPostInput = document.getElementById('selectedPostId');
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        // Existing event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-detail-btn') || e.target.closest('.view-detail-btn')) {
                this.handleViewDetail(e);
            }
            if (e.target.classList.contains('claim-btn') || e.target.closest('.claim-btn')) {
                this.handleClaimButton(e);
            }
        });

        // Modal close button
        if (this.closeClaimModal) {
            this.closeClaimModal.addEventListener('click', () => this.closeModal());
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.claimModal) {
                this.closeModal();
            }
        });

        // Form submission
        if (this.claimForm) {
            this.claimForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    async handleClaimButton(e) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.target.closest('.claim-btn');
        if (!button) return;

        const itemCard = button.closest('.item-card');
        if (!itemCard) return;

        // Check if user is authenticated
        const userId = this.getCurrentUserId();
        if (!userId) {
            if (confirm('You need to be logged in to make a claim. Go to login page?')) {
                window.location.href = '/login.html';
            }
            return;
        }

        // Set the current item ID and type from the item card
        this.currentItemId = itemCard.dataset.itemId;
        this.currentItemType = itemCard.dataset.itemType;

        console.log('Claim button clicked:', {
            currentItemId: this.currentItemId,
            currentItemType: this.currentItemType
        });

        // Show the modal
        this.openClaimModal();

        try {
            // Fetch user's items of the opposite type
            const posts = await this.fetchUserPosts();
            console.log('Fetched user posts:', posts);
            
            if (!posts || posts.length === 0) {
                this.userPostsList.innerHTML = `
                    <div class="no-posts">
                        <p>You don't have any ${this.currentItemType === 'lost' ? 'found' : 'lost'} posts.</p>
                        <a href="/${this.currentItemType === 'lost' ? 'found' : 'lost'}.html" class="create-post-link">
                            Create a ${this.currentItemType === 'lost' ? 'found' : 'lost'} post
                        </a>
                    </div>
                `;
                return;
            }
            
            this.renderUserPosts(posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
            this.userPostsList.innerHTML = '<div class="error">Error loading posts. Please try again.</div>';
        }
    }

    async fetchUserPosts() {
        try {
            const userId = this.getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }
    
            console.log('Fetching user items for claim linking...');
    
            // Determine which type of items to fetch (opposite of current item type)
            const itemType = this.currentItemType === 'lost' ? 'found' : 'lost';
            
            // Use the correct endpoint based on the item type
            const endpoint = itemType === 'lost' 
                ? `${API_BASE_URL}/lost-item/user/${userId}` 
                : `${API_BASE_URL}/found-item/user/${userId}`;
                
            // Fetch user's items of the opposite type
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
    
            if (response.status === 401) {
                if (confirm('Your session has expired. Would you like to log in again?')) {
                    window.location.href = '/login.html';
                }
                throw new Error('Session expired. Please log in again.');
            }
    
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.error('Server error:', error);
                throw new Error(error.message || 'Failed to fetch your items');
            }
    
            const items = await response.json();
            console.log('Fetched user items:', items);
            return items;
    
        } catch (error) {
            console.error('Error in fetchUserPosts:', error);
            throw error;
        }
    }

    renderUserPosts(posts) {
        this.userPostsList.innerHTML = '';
        
        if (!posts || posts.length === 0) {
            this.userPostsList.innerHTML = `
                <div class="no-posts">
                    <p>You don't have any ${this.currentItemType} posts.</p>
                    <a href="/${this.currentItemType}.html" class="create-post-link">Create a ${this.currentItemType} post</a>
                </div>
            `;
            return;
        }
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'user-post-item';
            postElement.dataset.postId = post.id || post._id;
            
            postElement.innerHTML = `
                <h4>${post.title || 'Untitled Post'}</h4>
                <p>${post.description ? (post.description.substring(0, 100) + (post.description.length > 100 ? '...' : '')) : 'No description'}</p>
                <small>Posted on: ${new Date(post.createdAt || post.date).toLocaleDateString()}</small>
            `;
            
            postElement.addEventListener('click', () => this.selectPost(post.id || post._id, postElement));
            this.userPostsList.appendChild(postElement);
        });
    }

    selectPost(postId, postElement) {
        // Remove selected class from all posts
        document.querySelectorAll('.user-post-item').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selected class to clicked post
        postElement.classList.add('selected');
        this.selectedPostId = postId;
        this.selectedPostInput.value = postId;
    }

    openClaimModal() {
        this.claimModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.claimModal) {
            this.claimModal.style.display = 'none';
            document.body.style.overflow = '';
            // Reset form
            if (this.claimForm) {
                this.claimForm.reset();
            }
            this.selectedPostId = null;
            this.userPostsList.innerHTML = '';
        }
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        if (!this.selectedPostId) {
            alert('Please select one of your items to link with this claim');
            return;
        }
    
        const formData = new FormData(this.claimForm);
        const currentUserId = this.getCurrentUserId();
        
        // Debug logs
        console.log('Current item type:', this.currentItemType);
        console.log('Current item ID (raw):', this.currentItemId, 'type:', typeof this.currentItemId);
        console.log('Selected post ID (raw):', this.selectedPostId, 'type:', typeof this.selectedPostId);
        console.log('Current user ID:', currentUserId);
    
        // Parse IDs
        const currentItemId = parseInt(this.currentItemId, 10);
        const selectedId = parseInt(this.selectedPostId, 10);
        
        console.log('Parsed currentItemId:', currentItemId);
        console.log('Parsed selectedId:', selectedId);
    
        if (isNaN(currentItemId) || isNaN(selectedId)) {
            console.error('Invalid IDs:', {
                currentItemId: this.currentItemId,
                selectedPostId: this.selectedPostId,
                parsedCurrent: currentItemId,
                parsedSelected: selectedId
            });
            alert('Invalid item selection. Please try again.');
            return;
        }
    
        // Create the item objects with proper type checking
        let lostItem, foundItem;
        
        if (this.currentItemType === 'lost') {
            lostItem = { id: currentItemId };
            foundItem = { id: selectedId };
        } else if (this.currentItemType === 'found') {
            lostItem = { id: selectedId };
            foundItem = { id: currentItemId };
        } else {
            throw new Error(`Invalid item type: ${this.currentItemType}`);
        }
    
        const claimData = {
            lostItem: lostItem,
            foundItem: foundItem,
            matchedByUser: { id: currentUserId },
            lostItemUserConfirmed: false,
            foundItemUserConfirmed: false,
            adminApproved: false,
            status: 'pending',
            matchDate: new Date().toISOString(),
            message: formData.get('message') || ''
        };
    
        console.log('Final claim data being sent:', JSON.stringify(claimData, null, 2));
    
        try {
            const submitButton = this.claimForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
    
            const response = await fetch(`${API_BASE_URL}/item-matched`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(claimData)
            });
    
            // First get the response as text
            const responseText = await response.text();
            let responseData;
            
            try {
                // Try to parse as JSON
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('Failed to parse JSON response. Response was:', responseText);
                throw new Error('Received invalid response from server: ' + responseText.substring(0, 100));
            }
    
            console.log('Response status:', response.status);
            console.log('Response data:', responseData);
    
            if (!response.ok) {
                if (response.status === 401) {
                    if (confirm('Your session has expired. Would you like to log in again?')) {
                        window.location.href = '/login.html';
                    }
                    return;
                }
                throw new Error(responseData.message || `Server error: ${response.status} ${response.statusText}`);
            }
    
            console.log('Claim submission successful:', responseData);
            alert('Claim submitted successfully! The item owner will be notified.');
            this.closeModal();
            window.location.reload();
    
        } catch (error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            alert(error.message || 'Failed to submit claim. Please check the console for details and try again.');
        } finally {
            const submitButton = this.claimForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Claim';
            }
        }
    }
    
    getCurrentUserId() {
        try {
            const userData = sessionStorage.getItem('user');
            if (!userData) {
                console.log('No user data found in sessionStorage');
                return null;
            }
    
            const user = JSON.parse(userData);
            if (!user || !user.id) {
                console.log('Invalid user data format:', user);
                return null;
            }
    
            return user.id;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
}

// Initialize the modal handler
document.addEventListener('DOMContentLoaded', () => {
    new ItemModalHandler();
});

// Initialize the handler
const itemModalHandler = new ItemModalHandler();

function formatDate(dateString) {
    if (!dateString) return 'Date not specified';
    
    // Try to parse the date string
    let date = new Date(dateString);
    
    // If the first attempt fails, try parsing as ISO string without timezone
    if (isNaN(date.getTime())) {
        // Try adding timezone offset if missing (common issue with some database formats)
        date = new Date(dateString.includes('Z') ? dateString : dateString + 'Z');
    }
    
    // If still invalid, try parsing as timestamp
    if (isNaN(date.getTime()) && !isNaN(dateString)) {
        date = new Date(parseInt(dateString));
    }
    
    // If all parsing attempts failed, return the original string
    if (isNaN(date.getTime())) {
        console.warn('Could not parse date:', dateString);
        return dateString || 'Date not available';
    }
    
    // Format the date in a user-friendly way
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
  }