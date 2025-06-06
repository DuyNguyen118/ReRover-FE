const API_BASE_URL = 'http://localhost:8080/api';

let allFoundItems = [];
let searchTimeout = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Found items page initialized');
    initializeFoundPage();
});

async function initializeFoundPage() {
    try {
        await loadFoundItems();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing found page:', error);
        showError('Failed to initialize page. Please refresh and try again.');
    }
}

async function loadFoundItems() {
    const container = document.querySelector('.found-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    try {
        showLoading(true);
        container.innerHTML = '<div class="loading-state">Loading items...</div>';
        
        const response = await fetch(`${API_BASE_URL}/found-item`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allFoundItems = await response.json();
        renderFoundItems(allFoundItems);
    } catch (error) {
        console.error('Error loading found items:', error);
        showError('Failed to load items. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function renderFoundItems(items = null, type = null) {
    const container = document.querySelector('.found-items-container .items-list');
    const noItemsElement = document.getElementById('no-items');
    
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    // Show loading state only if we're fetching new data
    if (items === null) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading items...</p>
            </div>`;
        return;
    }

    try {
        // If items is a single item, convert it to an array
        const itemsArray = Array.isArray(items) ? items : [items];
        
        if (itemsArray.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <p>No items found${type ? ` in category: ${type}` : ''}.</p>
                    <button onclick="loadFoundItems()">Refresh</button>
                </div>`;
            return;
        }

        container.innerHTML = itemsArray.map(item => createFoundItemCard(item)).join('');
    } catch (error) {
        console.error('Error rendering items:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Failed to load items. Please try again later.</p>
                <p><small>${error.message || 'Unknown error occurred'}</small></p>
                <button onclick="loadFoundItems()">Try Again</button>
            </div>`;
    }
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function createFoundItemCard(item) {
    // Handle image URL - check if item has images array and it's not empty
    const imageUrl = item.imageUrl 
        ? `${API_BASE_URL}/found-item/files/${encodeURIComponent(item.imageUrl)}`
        : 'images/placeholder.jpg';
        
    return `
        <div class="item-card" data-id="${item.id}">
            <div class="item-image" style="width: 100%; height: 200px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
                <img src="${imageUrl}" 
                     alt="${item.title || 'Found item'}" 
                     style="width: 100%; height: 100%; object-fit: cover; object-position: center;"
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="item-details">
                <h3>${item.title || 'Unnamed Item'}</h3>
                <p><strong>Found at:</strong> ${item.location || 'Unknown location'}</p>
                <p><strong>Date Found:</strong> ${new Date(item.foundDate).toLocaleDateString() || 'Unknown date'}</p>
                <div class="item-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                    <button class="btn-view" onclick="viewItemDetails('${item.id}')" style="flex: 1; padding: 8px 12px; background: #000000; color: white; font-family: 'Space Grotesk', sans-serif; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                        View Details
                    </button>
                    <button class="btn-claim" data-item-id="${item.id}" onclick="handleClaimClick(event, '${item.id}')" 
                            style="flex: 1; padding: 8px 12px; background: #4CAF50; color: white; font-family: 'Space Grotesk', sans-serif; border: none; border-radius: 4px; cursor: pointer;">
                        Claim
                    </button>
                </div>
            </div>
        </div>
    `;
}

function handleSearch(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Show loading state
    const container = document.querySelector('.found-items-container .items-list');
    if (container) {
        container.innerHTML = '<div class="loading-state">Searching...</div>';
    }
    
    // Add debouncing (1000ms delay)
    searchTimeout = setTimeout(() => {
        if (!searchTerm) {
            // If search is empty, show all items
            renderFoundItems(allFoundItems);
            return;
        }
        
        // Filter items based on search term
        const filteredItems = allFoundItems.filter(item => {
            return (
                (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                (item.location && item.location.toLowerCase().includes(searchTerm)) ||
                (item.category && item.category.toLowerCase().includes(searchTerm))
            );
        });
        
        // Render filtered items
        renderFoundItems(filteredItems);
    }, 1000);
}

function setupEventListeners() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(e);
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            if (searchInput) {
                handleSearch({ target: searchInput });
            }
        });
    }
    
    // Add event listener for category filter
    const categorySelect = document.querySelector('.category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const category = e.target.value;
            if (!category) {
                renderFoundItems(allFoundItems);
                return;
            }
            
            const filteredItems = allFoundItems.filter(item => 
                item.category && item.category.toLowerCase() === category.toLowerCase()
            );
            renderFoundItems(filteredItems);
        });
    }
    
    // Add event listener for sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            let sortedItems = [...allFoundItems];
            
            switch(sortBy) {
                case 'recent':
                sortedItems.sort((a, b) => new Date(b.foundDate) - new Date(a.foundDate));
                break;
            case 'oldest':
                sortedItems.sort((a, b) => {
                    // Handle potential invalid dates
                    const dateA = new Date(a.foundDate).getTime() || 0;
                    const dateB = new Date(b.foundDate).getTime() || 0;
                    return dateA - dateB; // Oldest first
                });
                break;
                case 'az':
                    sortedItems.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                    break;
                case 'za':
                    sortedItems.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
                    break;
            }
            
            renderFoundItems(sortedItems);
        });
    }
}

function handleClaimClick(event, itemId) {
    event.stopPropagation();
    
    // Store the item ID in the claim form
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.dataset.itemId = itemId;
    }
    
    // Show the claim modal
    const modal = document.getElementById('claimModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Make functions available globally
window.loadFoundItems = loadFoundItems;
window.viewItemDetails = function(id) {
    // Implement view details functionality
    console.log('Viewing item:', id);
};
window.handleClaimClick = handleClaimClick;
window.handleSearch = handleSearch;
