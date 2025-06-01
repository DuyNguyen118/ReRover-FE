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
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        // In a real app, this would filter the items
        alert(`Searching for: ${searchTerm}`);
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
            alert('Claim functionality would open here');
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

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080/api';

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
    return `
        <div class="item-card" data-id="${item.id}">
            <img src="${item.imageUrl || 'images/placeholder.jpg'}" alt="${item.title || 'Found item'}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">${item.title || 'Unnamed Item'}</h3>
                <p class="item-location">Location: ${item.location || 'Not specified'}</p>
                <p class="item-category">Category: ${item.category || 'Not specified'}</p>
                <p class="item-date">Found on: ${item.foundDate || new Date().toLocaleDateString()}</p>
                <div class="item-actions">
                    <button class="view-detail-btn">View Details</button>
                    <button class="claim-btn">Claim</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render found items in the UI
async function renderFoundItems(type = null) {
    const container = document.querySelector('.found-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading found items...</p>
        </div>`;

    try {
        const items = type ? await fetchFoundItems(type) : await fetchFoundItems();

        const recentItems = items
            .sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate))
            .slice(0, 2);
        
        if (!Array.isArray(items)) {
            throw new Error('Invalid response from server');
        }
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <p>No items found${type ? ` in category: ${type}` : ''}.</p>
                    <button onclick="renderFoundItems(${type ? `'${type}'` : ''})">Refresh</button>
                </div>`;
            return;
        }

        container.innerHTML = recentItems.map(createFoundItemCard).join('');
        attachFoundItemListeners();
    } catch (error) {
        console.error('Error in renderFoundItems:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load items. Please try again later.</p>
                <p><small>${error.message || 'Unknown error occurred'}</small></p>
                <button onclick="renderFoundItems(${type ? `'${type}'` : ''})">Try Again</button>
            </div>`;
    }
}

// Function to attach event listeners to found item cards
function attachFoundItemListeners() {
    // View detail button click
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.closest('.item-card').dataset.id;
            // In a real app, you would navigate to a detail page or show a modal
            alert(`Viewing details for found item ${itemId}`);
        });
    });

    // Claim button click
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemCard = this.closest('.item-card');
            const itemId = itemCard.dataset.id;
            const itemName = itemCard.querySelector('.item-name').textContent;
            
            if (confirm(`Are you sure you want to claim "${itemName}"?`)) {
                // In a real app, you would make an API call to claim the item
                alert(`Claim request sent for "${itemName}". We'll contact you soon.`);
            }
        });
    });
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
    return `
        <div class="item-card" data-id="${item.id}">
            <img src="${item.imageUrl || 'images/placeholder.jpg'}" alt="${item.title || 'Lost item'}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">${item.title || 'Unnamed Item'}</h3>
                <p class="item-location">Location: ${item.location || 'Not specified'}</p>
                <p class="item-category">Category: ${item.category || 'Not specified'}</p>
                <p class="item-date">Lost on: ${item.lostDate || new Date().toLocaleDateString()}</p>
                <div class="item-actions">
                    <button class="view-detail-btn">View Details</button>
                    <button class="claim-btn">Claim</button>
                </div>
            </div>
        </div>
    `;
}

// Function to render found items in the UI
async function renderLostItems(type = null) {
    const container = document.querySelector('.lost-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading lost items...</p>
        </div>`;

    try {
        const items = type ? await fetchLostItems(type) : await fetchLostItems();

        const recentItems = items
            .sort((a, b) => new Date(b.lostDate) - new Date(a.lostDate))
            .slice(0, 2);
        
        if (!Array.isArray(items)) {
            throw new Error('Invalid response from server');
        }
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <p>No items found${type ? ` in category: ${type}` : ''}.</p>
                    <button onclick="renderLostItems(${type ? `'${type}'` : ''})">Refresh</button>
                </div>`;
            return;
        }

        container.innerHTML = recentItems.map(createLostItemCard).join('');
        attachLostItemListeners();
    } catch (error) {
        console.error('Error in renderLostItems:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load items. Please try again later.</p>
                <p><small>${error.message || 'Unknown error occurred'}</small></p>
                <button onclick="renderLostItems(${type ? `'${type}'` : ''})">Try Again</button>
            </div>`;
    }
}

// Function to attach event listeners to lost item cards
function attachLostItemListeners() {
    // View detail button click
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.closest('.item-card').dataset.id;
            // In a real app, you would navigate to a detail page or show a modal
            alert(`Viewing details for lost item ${itemId}`);
        });
    });

    // Claim button click
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemCard = this.closest('.item-card');
            const itemId = itemCard.dataset.id;
            const itemName = itemCard.querySelector('.item-name').textContent;
            
            if (confirm(`Are you sure you want to claim "${itemName}"?`)) {
                // In a real app, you would make an API call to claim the item
                alert(`Claim request sent for "${itemName}". We'll contact you soon.`);
            }
        });
    });
}