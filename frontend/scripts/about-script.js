// Additional JavaScript for about page
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        contactType: document.querySelector('input[name="contactType"]:checked').value,
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value
    };
            
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields');
        return;
    }
            
    if (!isValidEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
    }
            
    // Show loading state
    const sendBtn = document.querySelector('.send-btn');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;
            
    // Simulate API call
    setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
                
        alert('Message sent successfully! We\'ll get back to you soon.');
        document.getElementById('contactForm').reset();
        document.getElementById('sayHi').checked = true;
    }, 1500);
    }
    
    function explorecareers() {
        alert('Careers page would open here. Join our amazing team!');
        // In a real app, this would navigate to careers page
        // window.location.href = '/careers';
    }
        
    // Add smooth animations on scroll
    document.addEventListener('DOMContentLoaded', function() {
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
            
        // Observe sections for animation
        const sections = document.querySelectorAll('.hero-section, .team-section, .join-team-section, .contact-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    });
        
    // Add hover effects to team cards
    document.addEventListener('DOMContentLoaded', function() {
        const teamCards = document.querySelectorAll('.team-card');
            
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'transform 0.3s ease';
            });
                
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });
