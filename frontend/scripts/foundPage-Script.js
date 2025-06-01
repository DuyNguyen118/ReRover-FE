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
    return `
        <div class="item-card" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.imageUrl || 'images/placeholder-item.jpg'}" alt="${item.title}">
            </div>
            <div class="item-details">
                <h3>${item.title || 'Unnamed Item'}</h3>
                <p><strong>Found at:</strong> ${item.location || 'Unknown location'}</p>
                <p><strong>Date Found:</strong> ${new Date(item.foundDate).toLocaleDateString() || 'Unknown date'}</p>
                <button class="btn-view" onclick="viewItemDetails('${item.id}')">View Details</button>
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

// Make functions available globally
window.loadFoundItems = loadFoundItems;
window.viewItemDetails = function(id) {
    // Implement view details functionality
    console.log('Viewing item:', id);
};