/**
 * Life-OS SPA-like Navigation
 * Prevents full page reloads for internal navigation
 */

(function () {
    'use strict';

    // Check if we should use SPA navigation
    const isSameOrigin = (url) => {
        try {
            return new URL(url, window.location.origin).origin === window.location.origin;
        } catch {
            return false;
        }
    };

    // Check if link should be handled by SPA navigation
    const shouldHandleLink = (anchor) => {
        // Skip if no href
        if (!anchor.href) return false;

        // Skip external links
        if (!isSameOrigin(anchor.href)) return false;

        // Skip download links
        if (anchor.hasAttribute('download')) return false;

        // Skip target="_blank" links
        if (anchor.target === '_blank') return false;

        // Skip mailto/tel links
        if (anchor.href.startsWith('mailto:') || anchor.href.startsWith('tel:')) return false;

        // Skip hash-only links on same page
        const url = new URL(anchor.href);
        if (url.pathname === window.location.pathname && url.hash) return false;

        return true;
    };

    // Page cache for instant navigation
    const pageCache = new Map();
    const MAX_CACHE_SIZE = 10;

    // Add page to cache with LRU eviction
    const cachePageContent = (url, content) => {
        if (pageCache.size >= MAX_CACHE_SIZE) {
            const firstKey = pageCache.keys().next().value;
            pageCache.delete(firstKey);
        }
        pageCache.set(url, {
            content,
            timestamp: Date.now()
        });
    };

    // Get page content (from cache or fetch)
    const getPageContent = async (url) => {
        const cached = pageCache.get(url);
        if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
            return cached.content;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const html = await response.text();
        cachePageContent(url, html);
        return html;
    };

    // Parse HTML and extract content
    const parseHTML = (html) => {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    };

    // Apply page transition
    const applyTransition = (callback) => {
        const main = document.querySelector('.main-content') || document.body;

        // Fade out
        main.style.opacity = '0';
        main.style.transition = 'opacity 0.15s ease-out';

        setTimeout(() => {
            callback();

            // Fade in
            requestAnimationFrame(() => {
                main.style.opacity = '1';
                main.style.transition = 'opacity 0.2s ease-in';
            });
        }, 150);
    };

    // Update the page content
    const updatePage = (newDoc) => {
        // Update title
        document.title = newDoc.title;

        // Update main content
        const currentMain = document.querySelector('.main-content');
        const newMain = newDoc.querySelector('.main-content');

        if (currentMain && newMain) {
            currentMain.innerHTML = newMain.innerHTML;
        }

        // Update active nav links
        updateActiveNavLinks();

        // Reinitialize any dynamic components
        reinitializeComponents();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Update active navigation links
    const updateActiveNavLinks = () => {
        const currentPath = window.location.pathname;

        // Update sidebar nav
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            link.classList.toggle('active',
                linkPath === currentPath ||
                currentPath.endsWith(linkPath.split('/').pop())
            );
        });

        // Update bottom nav
        document.querySelectorAll('.bottom-nav-item').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            link.classList.toggle('active',
                linkPath === currentPath ||
                currentPath.endsWith(linkPath.split('/').pop())
            );
        });
    };

    // Reinitialize dynamic components after navigation
    const reinitializeComponents = () => {
        // Reinit accordions
        if (typeof initAccordions === 'function') {
            initAccordions();
        }

        // Reinit expandable cards
        if (typeof initExpandableCards === 'function') {
            initExpandableCards();
        }

        // Reinit from LifeOSMobile if available
        if (window.LifeOSMobile) {
            // Components will self-initialize on DOMContentLoaded-like triggers
        }

        // Trigger custom event for other scripts
        document.dispatchEvent(new CustomEvent('life-os:navigate'));
    };

    // Navigate to a new page
    const navigateTo = async (url, pushState = true) => {
        try {
            // Show loading state
            document.body.classList.add('navigating');

            const html = await getPageContent(url);
            const newDoc = parseHTML(html);

            applyTransition(() => {
                updatePage(newDoc);

                if (pushState) {
                    history.pushState({ url }, '', url);
                }

                document.body.classList.remove('navigating');
            });

        } catch (error) {
            console.error('[Navigation] Failed:', error);
            // Fallback to traditional navigation
            window.location.href = url;
        }
    };

    // Handle link clicks
    const handleLinkClick = (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || !shouldHandleLink(anchor)) return;

        event.preventDefault();
        navigateTo(anchor.href);
    };

    // Handle browser back/forward
    const handlePopState = (event) => {
        if (event.state?.url) {
            navigateTo(event.state.url, false);
        } else {
            navigateTo(window.location.href, false);
        }
    };

    // Prefetch pages on hover
    const handleLinkHover = (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || !shouldHandleLink(anchor)) return;

        // Only prefetch if not already cached
        if (!pageCache.has(anchor.href)) {
            // Use low priority fetch
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    fetch(anchor.href, { priority: 'low' }).then(res => res.text()).then(html => {
                        cachePageContent(anchor.href, html);
                    }).catch(() => { });
                });
            }
        }
    };

    // Initialize navigation
    const init = () => {
        // Set initial state
        history.replaceState({ url: window.location.href }, '', window.location.href);

        // Listen for link clicks (use capture for early interception)
        document.addEventListener('click', handleLinkClick, true);

        // Listen for back/forward navigation
        window.addEventListener('popstate', handlePopState);

        // Prefetch on hover
        document.addEventListener('mouseenter', handleLinkHover, true);

        // Add navigation styles
        const style = document.createElement('style');
        style.textContent = `
            .navigating .main-content {
                pointer-events: none;
            }
            .main-content {
                transition: opacity 0.2s ease;
            }
        `;
        document.head.appendChild(style);

        console.log('[Navigation] SPA navigation initialized');
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.LifeOSNav = {
        navigateTo,
        prefetch: (url) => getPageContent(url)
    };
})();
