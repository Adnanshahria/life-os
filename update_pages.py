import os
import re

files = [
    'index.html',
    'books/atomic-habits.html',
    'books/deep-work.html',
    'books/daily-stoic.html',
    'books/dopamine-detox.html',
    'guides/unified-study-guide.html',
    'guides/study-guide-1.html',
    'guides/study-guide-2.html',
    'protocols/life-protocol.html'
]

base_dir = r"c:/Users/Adnan Shahria/Desktop/Project-1"

print("Starting update process...")

for file_path in files:
    full_path = os.path.join(base_dir, file_path)
    if not os.path.exists(full_path):
        print(f"Skipping {file_path} (not found)")
        continue

    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        changed = False

        # 1. Remove Style Block (Match <style>...</style>)
        if '<style>' in content:
            # Note: This regex is simple and assumes no nested styles or tricky comments.
            # Given the known structure, this is safe.
            content = re.sub(r'<style>[\s\S]*?</style>', '', content, flags=re.IGNORECASE)
            changed = True
            print(f"Removed style block from {file_path}")

        # 2. Add main.css link
        is_root = '/' not in file_path
        main_css = 'css/main.css' if is_root else '../css/main.css'
        mobile_css = 'css/mobile.css' if is_root else '../css/mobile.css'
        
        # Ensure main.css is present
        if main_css not in content:
            # Try to insert before mobile.css
            if mobile_css in content:
                content = content.replace(content[content.find(mobile_css)-25:content.find(mobile_css)+len(mobile_css)+2], f'<link rel="stylesheet" href="{main_css}">\n    <link rel="stylesheet" href="{mobile_css}">') 
                # The generic replace above is risky if context match fails.
                # Safer: replace specifically the mobile css line if we can find it exactly
                content = re.sub(f'.*href=[\'"]{re.escape(mobile_css)}[\'"].*', f'    <link rel="stylesheet" href="{main_css}">\n    <link rel="stylesheet" href="{mobile_css}">', content)
                changed = True
                print(f"Added main.css to {file_path}")

        # 3. Update header class
        if 'class="mobile-header"' in content:
            content = content.replace('class="mobile-header"', 'class="main-header"')
            changed = True
            print(f"Updated header class in {file_path}")

        # 3b. Update brand-logo container
        if '<div style="display: flex; align-items: center; gap: 0.5rem;">' in content:
            content = content.replace('<div style="display: flex; align-items: center; gap: 0.5rem;">', '<div class="brand-logo-container">')
            changed = True
            print(f"Updated brand container in {file_path}")
            
        # 4. Remove sidebar brand
        if '<div class="brand">' in content:
            content = re.sub(r'<div class="brand">[\s\S]*?</div>', '', content, flags=re.IGNORECASE)
            changed = True
            print(f"Removed sidebar brand from {file_path}")

        # 5. Add SW script
        if 'serviceWorker.register' not in content:
            sw_script = """
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
            });
        }
    </script>"""
            content = content.replace('</body>', f'{sw_script}\n</body>')
            changed = True
            print(f"Added SW script to {file_path}")

        if changed:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Saved {file_path}")
        else:
            print(f"No changes for {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
