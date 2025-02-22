// Common functionality for all pages
const initializeLoader = () => {
    document.addEventListener('DOMContentLoaded', function() {
        const loader = document.querySelector('.loader-container');
        
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            document.body.classList.remove('js-loading');
            document.body.classList.add('js-loaded');
            
            loader.addEventListener('transitionend', () => {
                document.body.removeChild(loader);
            });
        }, 800);
    });
};

// Initialize dark mode
const initializeDarkMode = () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }
    
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }
};

// Initialize mobile menu
const initializeMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu && closeMobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }
};

// Initialize all common functionality
const initializeCommon = () => {
    initializeLoader();
    initializeDarkMode();
    initializeMobileMenu();
};

// Run initialization
initializeCommon(); 