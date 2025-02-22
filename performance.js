// Performance monitoring
const performanceMonitor = {
    init() {
        this.measurePageLoad();
        this.measureFirstContentfulPaint();
        this.measureLargestContentfulPaint();
    },

    measurePageLoad() {
        window.addEventListener('load', () => {
            const pageLoadTime = performance.now();
            console.log(`Page loaded in: ${pageLoadTime}ms`);
        });
    },

    measureFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
            console.log(`First Contentful Paint: ${fcp.startTime}ms`);
        }
    },

    measureLargestContentfulPaint() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
};

performanceMonitor.init(); 