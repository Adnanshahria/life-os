const fs = require('fs');
const path = require('path');
// Since this is running in node environment without full typescript support easily available for build scripts yet,
// we will parse MDX files roughly or just use a placeholder for now. 
// In a real scenario, we might use 'remark' or 'unified' to parse MDX.
// For this migration, we will scan the src/books and src/guides directories and create a simple index.

const booksDir = path.join(__dirname, '../my-app/src/books');
const guidesDir = path.join(__dirname, '../my-app/src/guides');
const outputDir = path.join(__dirname, '../my-app/public');

const index = [];

function scanDirectory(dir, type) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file.endsWith('.mdx')) {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            // Very naive title extraction
            const titleMatch = content.match(/# (.*)/);
            const title = titleMatch ? titleMatch[1] : file.replace('.mdx', '');

            index.push({
                title: title,
                path: `/${type}/${file.replace('.mdx', '.html')}`, // Match the routes defined in App.tsx
                category: type
            });
        }
    });
}

console.log('Building search index...');
scanDirectory(booksDir, 'books');
scanDirectory(guidesDir, 'guides');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'search-index.json'), JSON.stringify(index, null, 2));
console.log('Search index written to public/search-index.json');
