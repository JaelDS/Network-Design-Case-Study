/**
 * Network Security Project - JavaScript
 *
 * This file handles all interactive elements of the website including:
 * - Dark/light mode toggle
 * - Tab navigation for threats section
 * - Scroll animations
 * - Mobile menu functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initDarkMode();
  initTabs();
  initScrollEffects();
  initMobileMenu();
  enhanceAccessibility();
});

/**
 * Dark Mode Toggle
 * Switches between light and dark themes
 */
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
    const iconContainer = darkModeToggle.querySelector('.toggle-icon');

    // Set initial icon based on current theme
    updateThemeIcon();

    darkModeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      updateThemeIcon();
    });
  }

  // Helper function to update the theme icon
  function updateThemeIcon() {
    const iconContainer = darkModeToggle.querySelector('.toggle-icon');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    if (currentTheme === 'dark') {
      iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    } else {
      iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
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
        btn.setAttribute('aria-selected', 'false');
      });

      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
      });

      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const targetContent = document.getElementById(targetTab);
      targetContent.classList.add('active');
      targetContent.setAttribute('aria-hidden', 'false');
    });
  });
}

/**
 * Scroll Effects
 * Handles scroll-based animations and effects
 */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');

  // Navbar background change on scroll
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Initial check for page load with scroll already happened
  handleScroll();

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
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');

      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

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

  // Set mobile menu button ARIA attributes
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
  }

  // Make video placeholders accessible
  document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.setAttribute('role', 'button');
    placeholder.setAttribute('tabindex', '0');
    placeholder.setAttribute('aria-label', 'Play video');

    placeholder.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleVideoPlaceholderClick(this);
      }
    });

    placeholder.addEventListener('click', function() {
      handleVideoPlaceholderClick(this);
    });
  });
}

/**
 * Video Placeholder Interaction
 * Handles clicks on video placeholders
 */
function handleVideoPlaceholderClick(placeholder) {
  // In a real implementation, this would initialize a video player
  // For now, we'll just show an alert
  alert('Video playback would start here. This is a placeholder for the actual video content.');
}

/**
 * Performance Optimizations
 * Implements various performance improvements
 */
function optimizePerformance() {
  // Lazy load images (if not using native browser lazy loading)
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // Use requestAnimationFrame for scroll animations
  let ticking = false;

  function doSomethingOnScroll(scrollPos) {
    // Here you would update animations based on scroll position
    // This is more efficient than running in the scroll event directly
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    const lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function() {
        doSomethingOnScroll(lastKnownScrollPosition);
      });
      ticking = true;
    }
  });
}

// Call performance optimizations after initial load
window.addEventListener('load', optimizePerformance);