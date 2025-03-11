const loaderContainer = document.querySelector('.loader-container');
const progressBar = document.querySelector('.progress');
const introContainer = document.getElementById('intro-container');
const mainContent = document.querySelector('.main-content');
const enterBtn = document.querySelector('.enter-btn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const contactForm = document.getElementById('contactForm');

// Assets to preload - these will be actual paths in a production environment
const assetsToLoad = [
    { type: 'image', path: '/img/logo.png' },
    { type: 'image', path: '/img/background.jpg' },
    { type: 'image', path: '/img/texture1.jpg' },
    { type: 'image', path: '/img/texture2.jpg' },
    { type: 'model', path: '/models/can.glb' }
];

// Loading variables
let loadedItems = 0;
const totalItems = assetsToLoad.length || 10; // Fallback to 10 if no assets defined
let isLoaded = false;
let loadingComplete = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    // Start the loading sequence
    startLoading();
    
    // Add event listeners
    setupEventListeners();
    
    // Listen for visibility changes to handle tab switching
    handleVisibilityChange();
});

// Start the loading process
function startLoading() {
    if (assetsToLoad.length === 0) {
        // If no assets are defined, use simulated loading
        simulateLoading();
    } else {
        // Load real assets
        loadAssets();
    }
}

// Load real assets
function loadAssets() {
    assetsToLoad.forEach(asset => {
        switch(asset.type) {
            case 'image':
                const img = new Image();
                img.onload = () => assetLoaded();
                img.onerror = () => assetLoaded(); // Still continue on error
                img.src = asset.path;
                break;
                
            case 'model':
                // In a real implementation, this would use a proper 3D model loader
                // For now, simulate loading with a timeout
                setTimeout(() => assetLoaded(), 500);
                break;
                
            default:
                // Unknown asset type, just count it as loaded
                assetLoaded();
        }
    });
}

// When an asset is loaded
function assetLoaded() {
    loadedItems++;
    const percentage = (loadedItems / totalItems) * 100;
    updateProgressBar(percentage);
    
    if (loadedItems >= totalItems) {
        onLoadingComplete();
    }
}

// Simulate loading for development
function simulateLoading() {
    const loadingInterval = setInterval(() => {
        loadedItems++;
        updateProgressBar(loadedItems / totalItems * 100);
        
        if (loadedItems >= totalItems) {
            clearInterval(loadingInterval);
            onLoadingComplete();
        }
    }, 200);
}

// Update the progress bar
function updateProgressBar(percentage) {
    // Ensure percentage is between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    progressBar.style.width = `${percentage}%`;
    
    // Add a smooth transition when close to completion
    if (percentage > 80) {
        progressBar.style.transition = 'width 0.5s ease-out';
    }
}

// Actions to take when loading is complete
function onLoadingComplete() {
    // Prevent double execution
    if (loadingComplete) return;
    loadingComplete = true;
    
    // Hide loader with a fade out effect
    loaderContainer.style.opacity = '0';
    loaderContainer.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        loaderContainer.style.display = 'none';
        isLoaded = true;
        
        // Start the intro animation
        // animation.js will handle the 3D animation
    }, 500);
}

// Setup event listeners
function setupEventListeners() {
    // Enter site button
    enterBtn.addEventListener('click', enterSite);
    
    // Allow keyboard navigation as well
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
            enterBtn.click();
        }
    });
    
    // Add navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add scroll animations
    window.addEventListener('scroll', debounce(handleScroll, 50));
}

// Enter site event handler
function enterSite() {
    // Check if animation is loaded first
    if (!isLoaded) {
        console.warn('Trying to enter site before loading is complete');
        return;
    }
    
    // Add a class to animate the transition
    introContainer.classList.add('fade-out');
    
    // Fade out intro animation
    introContainer.style.opacity = '0';
    introContainer.style.transition = 'opacity 1s ease';
    
    // Show main content
    setTimeout(() => {
        introContainer.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('fade-in');
        
        // Set the hero section as active
        setActiveSection('hero');
        
        // Animate main content elements
        animateMainContent();
        
        // Update URL without refreshing the page
        history.pushState({page: 'main'}, 'Black Simba Energy', '#main');
    }, 1000);
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    
    // Get the target section ID
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    
    // Set the active section
    setActiveSection(targetId);
    
    // Close mobile menu if open
    const navList = document.querySelector('nav ul');
    if (navList.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Update URL
    history.pushState({page: targetId}, '', `#${targetId}`);
}

// Set active section
function setActiveSection(sectionId) {
    // Remove active class from all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top of section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Animate elements in the section
        animateSectionElements(targetSection);
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navList = document.querySelector('nav ul');
    navList.classList.toggle('active');
    
    // Toggle icon
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formValues);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Thank you for your message! We'll get back to you soon.</p>
    `;
    
    // Replace form with success message
    contactForm.innerHTML = '';
    contactForm.appendChild(successMessage);
    
    // Reset form after 5 seconds
    setTimeout(() => {
        contactForm.innerHTML = `
            <div class="form-group">
                <label for="name">NAME</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">EMAIL</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="subject">SUBJECT</label>
                <select id="subject" name="subject">
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="press">Press</option>
                </select>
            </div>
            <div class="form-group">
                <label for="message">MESSAGE</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn primary-btn">SEND MESSAGE</button>
        `;
        
        // Re-add event listener
        contactForm.addEventListener('submit', handleFormSubmit);
    }, 5000);
}

// Animate main content elements
function animateMainContent() {
    // Get all animatable elements
    const elements = document.querySelectorAll('.main-content h1, .main-content p, .main-content .product-item');
    
    // Add staggered animation to each element
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in');
        }, index * 100); // Staggered delay
    });
}

// Animate section elements
function animateSectionElements(section) {
    // Get all animatable elements in the section
    const elements = section.querySelectorAll('.slide-up, .slide-down, .fade-in');
    
    // Reset animations
    elements.forEach(el => {
        el.style.opacity = '0';
    });
    
    // Add staggered animation to each element
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 100 + 100); // Staggered delay
    });
}

// Handle scroll animations
function handleScroll() {
    // Get all animatable elements
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('active');
        }
    });
}

// Handle tab visibility changes to improve performance
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations or heavy processes when tab is not visible
            console.log('Tab hidden, pausing heavy animations');
        } else {
            // Resume when tab becomes visible again
            console.log('Tab visible, resuming animations');
        }
    });
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Update any size-dependent elements
    console.log('Window resized, updating layout');
}, 250));

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Handle browser back/forward navigation
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        setActiveSection(e.state.page);
    } else {
        // Default to hero section
        setActiveSection('hero');
    }
});

// Export functions that might be needed by other scripts
export { updateProgressBar, onLoadingComplete };