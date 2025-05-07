/**
 * Network Security Project - JavaScript
 *
 * This file handles all interactive elements of the website including:
 * - Dark/light mode toggle
 * - Tab navigation for threats section
 * - Scroll animations
 * - Mobile menu functionality
 * - Content security features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initDarkMode();
  initTabs();
  initScrollEffects();
  initMobileMenu();
  initSecurityFeatures();
});

/**
 * Dark Mode Toggle
 * Switches between light and dark themes
 */
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;


function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Check for system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  // Toggle theme when button is clicked
  if (darkModeToggle) {
    // Create a span element to hold the icon
    const iconContainer = darkModeToggle.querySelector('.toggle-icon') || document.createElement('span');
    iconContainer.className = 'toggle-icon';

    // Set initial icon based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    iconContainer.innerHTML = currentTheme === 'dark' ? sunIcon : moonIcon;

    // Append the icon container if it doesn't exist
    if (!darkModeToggle.querySelector('.toggle-icon')) {
      darkModeToggle.appendChild(iconContainer);
    }

    darkModeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Update the icon based on the new theme
      iconContainer.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

/**
 * Tab Navigation
 * Handles the tabbed content in the threats section
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the target tab content
      const targetTab = this.getAttribute('data-tab');

      // Remove active class from all buttons and content
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

/**
 * Scroll Effects
 * Handles scroll-based animations and effects
 */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('.section');

  // Navbar background change on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Initial check for page load with scroll already happened
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only prevent default for non-empty hrefs
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Account for fixed header height
          const headerHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Mobile Menu
 * Handles the mobile navigation menu
 */
function initMobileMenu() {
  // This would be implemented for the mobile hamburger menu
  // Since we're using a simple design for now, this is a placeholder
  // The full implementation would toggle a mobile-friendly navigation

  // Create mobile menu button element (not present in HTML yet)
  const createMobileMenuButton = () => {
    // Only create if not on desktop
    if (window.innerWidth <= 768) {
      const navbar = document.querySelector('.navbar .container');

      // Check if button already exists
      if (!document.querySelector('.mobile-menu-btn')) {
        // Create button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuBtn.innerHTML = `
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        `;

        // Insert before dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        navbar.insertBefore(mobileMenuBtn, darkModeToggle);

        // Add event listener
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
      }
    }
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    mobileMenuBtn.classList.toggle('active');
  };

  // Call on initial load
  createMobileMenuButton();

  // Update on window resize
  window.addEventListener('resize', createMobileMenuButton);
}

/**
 * Security Features
 * Implements client-side security measures
 */
function initSecurityFeatures() {
  // CSP Nonce generation
  function generateNonce() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';

    for (let i = 0; i < 16; i++) {
      nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return nonce;
  }

  // Apply nonce to script elements
  const nonce = generateNonce();
  const scriptElements = document.querySelectorAll('script:not([nonce])');

  scriptElements.forEach(script => {
    script.setAttribute('nonce', nonce);
  });

  // Sanitize user input (for potential form submissions)
  // This is a simple implementation - production would use a library
  window.sanitizeInput = function(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
  };

  // Add noopener and noreferrer to external links
  const externalLinks = document.querySelectorAll('a[target="_blank"]');

  externalLinks.forEach(link => {
    if (!link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
      const currentRel = link.getAttribute('rel') || '';
      link.setAttribute('rel', `${currentRel} noopener noreferrer`.trim());
    }
  });

  // Validate forms (for any potential data collection)
  function validateFormData(formData) {
    // Simple validation example
    // In a real app, this would be more comprehensive
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.email && !emailRegex.test(formData.email)) {
      isValid = false;
    }

    return isValid;
  }

  // Expose this function globally
  window.validateFormData = validateFormData;
}

/**
 * Video Placeholder Interaction
 * Handles clicks on video placeholders to show potential interaction
 */
document.querySelectorAll('.video-placeholder').forEach(placeholder => {
  placeholder.addEventListener('click', function() {
    // In a real implementation, this would initialize a video player
    // For now, we'll just show an alert
    alert('Video playback would start here. This is a placeholder for the actual video content.');
  });
});

/**
 * Accessibility Enhancements
 * Improves keyboard navigation and screen reader support
 */
function enhanceAccessibility() {
  // Add appropriate ARIA roles
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-hidden', content.classList.contains('active') ? 'false' : 'true');
  });

  // Keyboard navigation for tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

// Call accessibility enhancements after DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

/**
 * Performance Optimizations
 * Implements various performance improvements
 */
function optimizePerformance() {
  // Lazy load images (if not using native browser lazy loading)
  const lazyImages = document.querySelectorAll('img:not([loading])');
  lazyImages.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // Use requestAnimationFrame for scroll animations
  let lastKnownScrollPosition = 0;
  let ticking = false;

  function doSomethingOnScroll(scrollPos) {
    // Here you would update animations based on scroll position
    // This is more efficient than running in the scroll event directly
  }

  window.addEventListener('scroll', function() {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function() {
        doSomethingOnScroll(lastKnownScrollPosition);
        ticking = false;
      });

      ticking = true;
    }
  });
}

// Call performance optimizations after initial load
window.addEventListener('load', optimizePerformance);

/**
 * Custom event handling for project-specific interactions
 */
const SecurityEvents = {
  // Custom event emitter
  emit: function(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  },

  // Event listeners
  on: function(eventName, callback) {
    document.addEventListener(eventName, function(e) {
      callback(e.detail);
    });
  }
};

// Example usage of custom events
SecurityEvents.on('threat-selected', function(threatData) {
  console.log('Threat selected:', threatData);
  // Update UI based on selected threat
});

// When a tab is clicked, emit a custom event
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const threatType = this.getAttribute('data-tab');
      SecurityEvents.emit('threat-selected', { type: threatType });
    });
  });
});

/**
 * Additional cybersecurity visualizations
 * These would be implemented when specific sections are in view
 */
function initSecurityVisualizations() {
  // This is a placeholder for potential canvas or SVG visualizations
  // that could be added to enhance the security presentation

  // Example: Create a simple network connection visualization
  const createNetworkVisualization = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Implementation would go here
    // This would typically use canvas, SVG, or a library like D3.js
  };

  // Call for specific containers
  // createNetworkVisualization('network-viz-container');
}

// Initialize visualizations after page load
window.addEventListener('load', initSecurityVisualizations);