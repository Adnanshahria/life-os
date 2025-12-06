const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'books/atomic-habits.html',
    'books/deep-work.html',
    'books/daily-stoic.html',
    'books/dopamine-detox.html',
    'guides/unified-study-guide.html',
    'guides/study-guide-1.html',
    'guides/study-guide-2.html',
    'protocols/life-protocol.html'
];

files.forEach(filePath => {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping missing file: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // 1. Remove Style Block
    // Match <style>...</style> including newlines. 
    // We match specific expected content at start to avoid removing other styles if any
    const styleRegex = /<style>[\s\S]*?<\/style>/i;
    if (styleRegex.test(content)) {
        content = content.replace(styleRegex, '');
        changed = true;
        console.log(`Removed style block from ${filePath}`);
    }

    // 2. Add main.css link
    const isRoot = !filePath.includes('/');
    const mainCssLink = isRoot ? 'css/main.css' : '../css/main.css';
    const mobileCssLink = isRoot ? 'css/mobile.css' : '../css/mobile.css';
    const fontAwesomeLink = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

    if (!content.includes(mainCssLink)) {
        // Try to insert after Font Awesome
        if (content.includes(fontAwesomeLink)) {
            const replacement = `"${fontAwesomeLink}">\n    <link rel="stylesheet" href="${mainCssLink}">`;
            content = content.replace(`"${fontAwesomeLink}">`, replacement);
            changed = true;
            console.log(`Added main.css link to ${filePath}`);
        } else if (content.includes(mobileCssLink)) {
            // Fallback
            content = content.replace(mobileCssLink, `${mainCssLink}">\n    <link rel="stylesheet" href="${mobileCssLink}`);
            changed = true;
        }
    }

    // 3. Update header class
    if (content.includes('class="mobile-header"')) {
        content = content.replace('class="mobile-header"', 'class="main-header"');
        changed = true;
        console.log(`Updated header class in ${filePath}`);
    }

    // 3b. Update brand-logo container (ensure consistent structure if needed)
    // index.html was manually updated, others need check.
    // If they have <div style="display: flex..."> inside header, replace with <div class="brand-logo-container">
    if (content.includes('<div style="display: flex; align-items: center; gap: 0.5rem;">')) {
        content = content.replace('<div style="display: flex; align-items: center; gap: 0.5rem;">', '<div class="brand-logo-container">');
        changed = true;
        console.log(`Updated brand container in ${filePath}`);
    }

    // 4. Remove sidebar brand
    const brandRegex = /<div class="brand">[\s\S]*?<\/div>/i;
    if (brandRegex.test(content)) {
        content = content.replace(brandRegex, '');
        changed = true;
        console.log(`Removed sidebar brand from ${filePath}`);
    }

    // 5. Add SW script
    if (!content.includes('serviceWorker.register')) {
        const swScript = `
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }
    </script>`;
        content = content.replace('</body>', `${swScript}\n</body>`);
        changed = true;
        console.log(`Added SW script to ${filePath}`);
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Saved changes to ${filePath}`);
    } else {
        console.log(`No changes needed for ${filePath}`);
    }
});
