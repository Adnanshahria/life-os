/**
 * Mobile Interactions Module for Life-OS
 * Handles: expandable cards, lazy loading, reduced motion, accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
    initExpandableCards();
    initAccordions();
    initImageLazyLoading();
    initReducedMotionCheck();
    initBottomNavAccessibility();
    initCardEntranceAnimation();
});

/* ===========================================
   EXPANDABLE CARDS (ARIA-compliant)
   =========================================== */
function initExpandableCards() {
    const expandables = document.querySelectorAll('[data-expandable]');

    expandables.forEach(card => {
        const toggle = card.querySelector('.card__toggle, [data-toggle]');
        if (!toggle) return;

        // Set initial ARIA state if not already set
        if (!card.hasAttribute('aria-expanded')) {
            card.setAttribute('aria-expanded', 'false');
        }
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');

        // Click handler
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleExpand(card);
        });

        // Keyboard handler (Enter and Space)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpand(card);
            }
        });
    });
}

function toggleExpand(card) {
    const isExpanded = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', !isExpanded);
    card.classList.toggle('open', !isExpanded);

    // Announce state change for screen readers
    const toggle = card.querySelector('.card__toggle, [data-toggle]');
    if (toggle) {
        toggle.setAttribute('aria-pressed', !isExpanded);
    }
}

/* ===========================================
   ACCORDIONS (Legacy support + ARIA)
   =========================================== */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        if (!header) return;

        // Remove inline onclick if exists (will handle via JS)
        accordion.removeAttribute('onclick');

        // Set initial ARIA state
        if (!accordion.hasAttribute('aria-expanded')) {
            const isOpen = accordion.classList.contains('open');
            accordion.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');

        // Click handler
        header.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAccordion(accordion);
        });

        // Keyboard handler
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(accordion);
            }
        });
    });
}

function toggleAccordion(accordion) {
    const isExpanded = accordion.getAttribute('aria-expanded') === 'true';
    accordion.setAttribute('aria-expanded', !isExpanded);
    accordion.classList.toggle('open', !isExpanded);
}

/* ===========================================
   IMAGE LAZY LOADING (IntersectionObserver)
   =========================================== */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => {
            // Only observe images that haven't loaded
            if (!img.complete || img.dataset.src) {
                observer.observe(img);
            }
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

/* ===========================================
   REDUCED MOTION SUPPORT
   =========================================== */
function initReducedMotionCheck() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference(e) {
        document.documentElement.classList.toggle('reduce-motion', e.matches);
    }

    // Initial check
    handleMotionPreference(reducedMotion);

    // Listen for changes
    reducedMotion.addEventListener('change', handleMotionPreference);
}

/* ===========================================
   BOTTOM NAVIGATION ACCESSIBILITY
   =========================================== */
function initBottomNavAccessibility() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    // Set navigation landmark role
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    const items = nav.querySelectorAll('.bottom-nav-item');
    items.forEach((item, index) => {
        // Ensure focusable
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
        }

        // Arrow key navigation
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && index < items.length - 1) {
                e.preventDefault();
                items[index + 1].focus();
            } else if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                items[index - 1].focus();
            }
        });
    });
}

/* ===========================================
   CARD ENTRANCE ANIMATION
   =========================================== */
function initCardEntranceAnimation() {
    // Only animate if user hasn't disabled motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const cards = document.querySelectorAll('[data-animate="entrance"]');
    cards.forEach((card, index) => {
        card.style.setProperty('--anim-delay', index);
    });
}

/* ===========================================
   UTILITY: Smooth scroll to element
   =========================================== */
function smoothScrollTo(element, offset = 80) {
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
        top: top,
        behavior: reducedMotion ? 'auto' : 'smooth'
    });
}

// Export for use in other scripts if needed
window.LifeOSMobile = {
    toggleExpand,
    toggleAccordion,
    smoothScrollTo
};
