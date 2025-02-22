// Initialize copyright year immediately
(function() {
    function setYear() {
        const year = new Date().getFullYear();
        const copyrightElements = document.querySelectorAll('#copyright');
        copyrightElements.forEach(el => {
            if (el) el.innerHTML = `© ${year} SBI Loan Calculator. All rights reserved.`;
        });
    }

    // Run immediately
    setYear();

    // Run when DOM is ready
    document.addEventListener('DOMContentLoaded', setYear);

    // Run when window loads
    window.addEventListener('load', setYear);

    // Run every second for the first 5 seconds (aggressive approach)
    let attempts = 0;
    const interval = setInterval(() => {
        setYear();
        attempts++;
        if (attempts >= 5) clearInterval(interval);
    }, 1000);
})();

// DOM Elements
const form = document.getElementById('emiForm');
const results = document.getElementById('results');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
const shareButton = document.getElementById('shareResults');
const menuIcon = mobileMenuBtn?.querySelector('.menu-icon');
const closeIcon = mobileMenuBtn?.querySelector('.close-icon');
const closeMobileMenu = document.getElementById('closeMobileMenu');

// Ensure elements exist before adding event listeners
if (!mobileMenuBtn || !mobileMenu || !darkModeToggle) {
    console.error('Required elements not found');
}

// Dark mode initialization
function initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    }
}

initializeDarkMode();

// Toggle dark mode function
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add transition class temporarily
    document.body.classList.add('dark-mode-transition');
    setTimeout(() => {
        document.body.classList.remove('dark-mode-transition');
    }, 300);
}

// Dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

if (mobileDarkModeToggle) {
    mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
}

// Create backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
document.body.appendChild(backdrop);

// Mobile menu functions
function toggleMobileMenu() {
    const isHidden = mobileMenu.classList.contains('hidden');
    
    if (isHidden) {
        // Open menu
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        // Close menu
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Mobile menu event listeners
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', toggleMobileMenu);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden') && 
        !mobileMenuBtn.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
    }
});

// EMI Calculator
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get input values
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value) / 1200; // Monthly interest rate
    const years = parseInt(document.getElementById('years').value) || 0;
    const months = parseInt(document.getElementById('months').value) || 0;
    const tenure = years * 12 + months;

    // Calculate EMI
    const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    // Update results
    document.getElementById('monthlyEMI').textContent = `₹${emi.toFixed(2)}`;
    document.getElementById('totalInterest').textContent = `₹${totalInterest.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₹${totalAmount.toFixed(2)}`;

    // Show results section
    results.classList.remove('hidden');

    // Update pie chart
    updatePieChart(principal, totalInterest);
});

// Pie Chart
let pieChart = null;

function updatePieChart(principal, totalInterest) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principal, totalInterest],
                backgroundColor: ['#3b82f6', '#ef4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Share results
shareButton.addEventListener('click', async () => {
    try {
        const emi = document.getElementById('monthlyEMI').textContent;
        const totalInterest = document.getElementById('totalInterest').textContent;
        const totalAmount = document.getElementById('totalAmount').textContent;
        
        const shareText = `EMI Calculation Results:\n
Monthly EMI: ${emi}\n
Total Interest: ${totalInterest}\n
Total Amount: ${totalAmount}`;

        if (navigator.share) {
            await navigator.share({
                title: 'EMI Calculation Results',
                text: shareText
            });
        } else {
            await navigator.clipboard.writeText(shareText);
            alert('Results copied to clipboard!');
        }
    } catch (err) {
        console.error('Error sharing results:', err);
    }
});

// Input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', () => {
        if (input.value < 0) input.value = 0;
    });
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}

// Remove FOUC and handle loader
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after content loads
    const loader = document.querySelector('.loader-container');
    
    // Remove loader after a minimum display time
    setTimeout(() => {
        loader.classList.add('loader-hidden');
        document.body.classList.remove('js-loading');
        document.body.classList.add('js-loaded');
        
        // Remove loader from DOM after animation
        loader.addEventListener('transitionend', () => {
            document.body.removeChild(loader);
        });
    }, 800); // Minimum loader display time
});

// Show loader when calculating EMI
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const loader = document.querySelector('.loader-container');
    loader.classList.remove('loader-hidden');
    
    // Simulate calculation delay
    setTimeout(() => {
        calculateEMI();
        loader.classList.add('loader-hidden');
    }, 500);
}); 