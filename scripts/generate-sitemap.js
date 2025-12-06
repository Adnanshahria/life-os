const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../my-app/src/books');
const guidesDir = path.join(__dirname, '../my-app/src/guides');
const outputDir = path.join(__dirname, '../my-app/public');

const baseUrl = 'https://adnan-shahria.github.io/life-os'; // Example base URL, user can configure

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

function addUrl(path) {
    sitemap += `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add static pages
addUrl('/');

function scanDirectory(dir, type) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.mdx')) {
            addUrl(`/${type}/${file.replace('.mdx', '.html')}`);
        }
    });
}

console.log('Generating sitemap...');
scanDirectory(booksDir, 'books');
scanDirectory(guidesDir, 'guides');

sitemap += '</urlset>';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap);
console.log('Sitemap written to public/sitemap.xml');
