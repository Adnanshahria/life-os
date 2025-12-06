// DeepFocus Site Logic

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initSearch();
    initProgressTracking();
});

/* --- Themeing --- */
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        const isReading = document.body.classList.contains('reading-mode');
        localStorage.setItem('deepfocus-reading-mode', isReading);
    });

    // Restore preference
    if (localStorage.getItem('deepfocus-reading-mode') === 'true') {
        document.body.classList.add('reading-mode');
    }
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const panel = document.getElementById('mobile-menu-panel');

    if (!openBtn || !overlay || !panel) return;

    function openMenu() {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            panel.classList.remove('-translate-x-full');
        }, 10);
    }

    function closeMenu() {
        overlay.classList.add('opacity-0');
        panel.classList.add('-translate-x-full');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on overlay click (outside panel)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeMenu();
        }
    });
}

/* --- Search --- */
async function initSearch() {
    const input = document.getElementById('site-search');
    const resultsContainer = document.getElementById('search-results');

    if (!input || !resultsContainer) return;

    let index = [];
    try {
        // Handle relative path from any page depth
        const basePath = window.location.pathname.includes('/books/') ||
            window.location.pathname.includes('/guides/') ||
            window.location.pathname.includes('/protocols/')
            ? '../' : '';
        const resp = await fetch(basePath + 'search-index.json');
        index = await resp.json();
    } catch (e) {
        console.warn('Search index not found:', e);
        return;
    }

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = '';
            return;
        }

        const matches = index.filter(item =>
            item.title.toLowerCase().includes(query) ||
            (item.content && item.content.toLowerCase().includes(query))
        ).slice(0, 5);

        if (matches.length > 0) {
            // Handle relative paths
            const pathPrefix = window.location.pathname.includes('/books/') ||
                window.location.pathname.includes('/guides/') ||
                window.location.pathname.includes('/protocols/')
                ? '..' : '.';
            resultsContainer.innerHTML = matches.map(m => `
                <a href="${pathPrefix}${m.url}" class="block p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                    <div class="font-bold text-sm text-primary">${m.title}</div>
                    <div class="text-xs text-text-muted truncate">${m.content ? m.content.substring(0, 60) + '...' : ''}</div>
                </a>
            `).join('');
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = `<div class="p-3 text-sm text-text-muted">No results found</div>`;
            resultsContainer.classList.remove('hidden');
        }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
}

/* --- Progress Tracking --- */
function initProgressTracking() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html')) return;

    const key = `progress-${path}`;

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        if (scrolled > 0.9) {
            localStorage.setItem(key, '100%');
        } else {
            localStorage.setItem(key, Math.round(scrolled * 100) + '%');
        }
    });
}
