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