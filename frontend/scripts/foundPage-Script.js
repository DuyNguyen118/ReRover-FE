const API_BASE_URL = 'http://localhost:8080/api';

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
        showNotification('Failed to load found items. Please try again.', 'error');
    }
}

async function loadFoundItems() {
    const container = document.querySelector('.found-items-container .items-list');
    if (!container) {
        console.error('Items list container not found');
        return;
    }

    try {
        container.innerHTML = '<div class="loading-state">Loading items...</div>';
        
        const response = await fetch(`${API_BASE_URL}/found-item`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items = await response.json();
        renderFoundItems(items);
    } catch (error) {
        console.error('Error loading found items:', error);
        container.innerHTML = `
            <div class="error-state">
                Failed to load items. <button onclick="loadFoundItems()">Retry</button>
            </div>
        `;
    }
}

function renderFoundItems(items) {
    const container = document.querySelector('.found-items-container .items-list');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="no-items">No found items to display</div>';
        return;
    }

    container.innerHTML = items.map(item => createFoundItemCard(item)).join('');
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

function setupEventListeners() {
    // Add any event listeners here
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
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