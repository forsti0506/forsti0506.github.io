/**
 * Martin Forstner Portfolio - JavaScript
 * Handles navigation, animations, and interactive features
 * Built with accessibility in mind (WCAG 2.1 compliant)
 */

(function() {
    'use strict';

    // ==========================================
    // DOM Elements
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const backToTopBtn = document.querySelector('.back-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    const timelineTabs = document.querySelectorAll('.toggle-btn');
    const timelinePanels = document.querySelectorAll('.timeline-panel');
    const highlightNumbers = document.querySelectorAll('.highlight-number');
    
    // Theme and Language toggles
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');

    // Cursor elements (will be created dynamically)
    let cursorGlow, cursorDot, cursorRing;

    // ==========================================
    // Navigation
    // ==========================================
    
    /**
     * Toggle mobile navigation menu
     */
    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        
        // Update aria-label for screen readers
        navToggle.setAttribute('aria-label', isExpanded ? 'Menü öffnen' : 'Menü schließen');
    }

    /**
     * Close mobile menu when clicking a link
     */
    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Handle scroll events for navbar styling
     */
    function handleScroll() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (window.scrollY > 500) {
            backToTopBtn.hidden = false;
        } else {
            backToTopBtn.hidden = true;
        }
    }

    /**
     * Smooth scroll to top
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ==========================================
    // Timeline Tabs
    // ==========================================
    
    /**
     * Switch between timeline panels (work/education)
     */
    function switchTimelineTab(event) {
        const clickedTab = event.currentTarget;
        const targetPanelId = clickedTab.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetPanelId);

        // Update tab states
        timelineTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');

        // Update panel visibility
        timelinePanels.forEach(panel => {
            panel.classList.remove('active');
            panel.hidden = true;
        });
        targetPanel.classList.add('active');
        targetPanel.hidden = false;

        // Trigger fade-in animations for newly visible items
        targetPanel.querySelectorAll('.fade-in').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => {
                el.classList.add('visible');
            }, 100);
        });
    }

    /**
     * Handle keyboard navigation for tabs
     */
    function handleTabKeydown(event) {
        const tabs = Array.from(timelineTabs);
        const currentIndex = tabs.indexOf(event.currentTarget);
        let newIndex;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                tabs[newIndex].focus();
                tabs[newIndex].click();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                tabs[newIndex].focus();
                tabs[newIndex].click();
                break;
            case 'Home':
                event.preventDefault();
                tabs[0].focus();
                tabs[0].click();
                break;
            case 'End':
                event.preventDefault();
                tabs[tabs.length - 1].focus();
                tabs[tabs.length - 1].click();
                break;
        }
    }

    // ==========================================
    // Intersection Observer for Animations
    // ==========================================
    
    /**
     * Initialize fade-in animations using Intersection Observer
     */
    function initFadeInAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // If it's a highlight number, start counting animation
                    if (entry.target.classList.contains('about-highlights')) {
                        animateNumbers();
                    }
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });

        // Also observe highlights container
        const highlightsContainer = document.querySelector('.about-highlights');
        if (highlightsContainer) {
            observer.observe(highlightsContainer);
        }
    }

    // ==========================================
    // Number Animation
    // ==========================================
    
    let numbersAnimated = false;

    /**
     * Animate the highlight numbers counting up
     */
    function animateNumbers() {
        if (numbersAnimated) return;
        numbersAnimated = true;

        highlightNumbers.forEach(number => {
            const target = parseInt(number.dataset.count, 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                number.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    // ==========================================
    // Current Year in Footer
    // ==========================================
    
    function updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ==========================================
    // Keyboard Accessibility
    // ==========================================
    
    /**
     * Handle escape key to close mobile menu
     */
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus();
        }
    }

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }

                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL hash without jumping
                    history.pushState(null, null, href);

                    // Focus the target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    // ==========================================
    // Image Error Handling
    // ==========================================
    
    function handleImageError() {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.onerror = function() {
                // Fallback to a placeholder with initials
                this.style.display = 'none';
                const wrapper = this.parentElement;
                const placeholder = document.createElement('div');
                placeholder.className = 'hero-image-placeholder';
                placeholder.style.cssText = `
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 4rem;
                    font-weight: 700;
                    color: white;
                `;
                placeholder.textContent = 'MF';
                placeholder.setAttribute('role', 'img');
                placeholder.setAttribute('aria-label', 'Martin Forstner Initialen');
                wrapper.insertBefore(placeholder, this);
            };
        }
    }

    // ==========================================
    // Reduced Motion Support
    // ==========================================
    
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Immediately show all fade-in elements
            fadeElements.forEach(el => {
                el.classList.add('visible');
            });
            
            // Set numbers immediately
            highlightNumbers.forEach(number => {
                number.textContent = number.dataset.count;
            });
            numbersAnimated = true;
        }
        
        return prefersReducedMotion;
    }

    // ==========================================
    // Custom Mouse Cursor Animation
    // ==========================================
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let ringX = 0;
    let ringY = 0;
    let isMouseMoving = false;
    let sparkleThrottle = 0;

    /**
     * Create custom cursor elements
     */
    function createCursorElements() {
        // Check if touch device or reduced motion
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isTouchDevice || prefersReducedMotion) return;

        // Create glow element
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorGlow);

        // Create dot element
        cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        cursorDot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorDot);

        // Create ring element
        cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';
        cursorRing.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorRing);

        // Initialize cursor animation
        initCursorAnimation();
    }

    /**
     * Initialize cursor animation loop
     */
    function initCursorAnimation() {
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;

            // Activate cursor elements
            cursorGlow.classList.add('active');
            cursorDot.classList.add('active');
            cursorRing.classList.add('active');

            // Create occasional sparkles
            sparkleThrottle++;
            if (sparkleThrottle % 5 === 0) {
                createSparkle(mouseX, mouseY);
            }
        });

        // Mouse leave handler
        document.addEventListener('mouseleave', () => {
            isMouseMoving = false;
            cursorGlow.classList.remove('active');
            cursorDot.classList.remove('active');
            cursorRing.classList.remove('active');
        });

        // Mouse down/up for click effect
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('clicking');
            // Create burst of sparkles on click
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createSparkle(
                        mouseX + (Math.random() - 0.5) * 30,
                        mouseY + (Math.random() - 0.5) * 30
                    );
                }, i * 30);
            }
        });

        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('clicking');
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .contact-card, .skill-tag, .timeline-content, .toggle-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovering');
            });
        });

        // Start animation loop
        animateCursor();
    }

    /**
     * Animate cursor with smooth lerp
     */
    function animateCursor() {
        // Smooth interpolation (lerp)
        const lerpFactor = 0.15;
        const ringLerpFactor = 0.08;

        cursorX += (mouseX - cursorX) * lerpFactor;
        cursorY += (mouseY - cursorY) * lerpFactor;
        ringX += (mouseX - ringX) * ringLerpFactor;
        ringY += (mouseY - ringY) * ringLerpFactor;

        // Update positions
        if (cursorGlow) {
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
        }
        if (cursorDot) {
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        }
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }

    /**
     * Create a sparkle particle
     */
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.setAttribute('aria-hidden', 'true');
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background = Math.random() > 0.5 ? 'var(--color-primary-light)' : 'var(--color-secondary)';
        document.body.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, 600);
    }

    // ==========================================
    // Theme Toggle
    // ==========================================
    
    /**
     * Initialize theme from localStorage or system preference
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        // Only switch to light if explicitly saved as light
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeToggle) {
                themeToggle.setAttribute('aria-checked', 'true');
                themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            }
        } else {
            // Dark theme is the default
            document.documentElement.removeAttribute('data-theme');
            if (themeToggle) {
                themeToggle.setAttribute('aria-checked', 'false');
                themeToggle.setAttribute('aria-label', 'Switch to light theme');
            }
        }
    }
    
    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.setAttribute('aria-checked', 'false');
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.setAttribute('aria-checked', 'true');
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    // ==========================================
    // Language Toggle
    // ==========================================
    
    /**
     * Initialize language from localStorage
     */
    function initLanguage() {
        const savedLang = localStorage.getItem('language') || 'en';
        
        if (savedLang === 'de') {
            document.documentElement.lang = 'de';
            applyLanguage('de');
            if (langToggle) {
                langToggle.setAttribute('aria-checked', 'true');
                langToggle.setAttribute('aria-label', 'Switch to English');
            }
        } else {
            document.documentElement.lang = 'en';
            applyLanguage('en');
            if (langToggle) {
                langToggle.setAttribute('aria-checked', 'false');
                langToggle.setAttribute('aria-label', 'Switch to German');
            }
        }
    }
    
    /**
     * Toggle between English and German
     */
    function toggleLanguage() {
        const isGerman = document.documentElement.lang === 'de';
        
        if (isGerman) {
            document.documentElement.lang = 'en';
            localStorage.setItem('language', 'en');
            applyLanguage('en');
            langToggle.setAttribute('aria-checked', 'false');
            langToggle.setAttribute('aria-label', 'Switch to German');
        } else {
            document.documentElement.lang = 'de';
            localStorage.setItem('language', 'de');
            applyLanguage('de');
            langToggle.setAttribute('aria-checked', 'true');
            langToggle.setAttribute('aria-label', 'Switch to English');
        }
    }
    
    /**
     * Apply language to all translatable elements
     */
    function applyLanguage(lang) {
        const translatableElements = document.querySelectorAll('[data-en][data-de]');
        
        translatableElements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }

    // ==========================================
    // Initialize Everything
    // ==========================================
    
    function init() {
        // Check for reduced motion preference
        checkReducedMotion();

        // Initialize custom cursor
        createCursorElements();

        // Update current year
        updateCurrentYear();

        // Initialize smooth scroll
        initSmoothScroll();

        // Initialize fade-in animations
        initFadeInAnimations();

        // Handle image errors
        handleImageError();

        // Event Listeners
        navToggle.addEventListener('click', toggleMobileMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        backToTopBtn.addEventListener('click', scrollToTop);

        timelineTabs.forEach(tab => {
            tab.addEventListener('click', switchTimelineTab);
            tab.addEventListener('keydown', handleTabKeydown);
        });

        document.addEventListener('keydown', handleEscapeKey);

        // Theme and Language toggle listeners
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
        }

        // Initialize theme and language from localStorage
        initTheme();
        initLanguage();

        // Initial scroll check
        handleScroll();

        // Log accessibility info
        console.log('%c👋 Welcome to Martin Forstner\'s Portfolio!', 'font-size: 16px; font-weight: bold; color: #6366f1;');
        console.log('%c♿ This site was built with accessibility in mind (WCAG 2.1 compliant)', 'font-size: 12px; color: #06b6d4;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
