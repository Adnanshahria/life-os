
import os
import shutil
import hashlib
import json
import datetime
import re

# CONFIGURATION
SOURCE_ROOT = os.path.abspath(r".") 
DEST_ROOT = os.path.abspath(r"my-app")
ARCHIVE_DIR = os.path.join(DEST_ROOT, "src/_archive/original_site")
ASSETS_ARCHIVE_DIR = os.path.join(DEST_ROOT, "public/_archive_assets")
JS_ARCHIVE_DIR = os.path.join(DEST_ROOT, "src/_archive_js")
CSS_ARCHIVE_DIR = os.path.join(DEST_ROOT, "src/styles/_legacy")
PUBLIC_JS_ARCHIVE = os.path.join(DEST_ROOT, "public/_archive_assets/js")
PUBLIC_CSS_ARCHIVE = os.path.join(DEST_ROOT, "public/_archive_assets/css")

SOURCE_DIRS = ["books", "guides", "protocols"]
ASSET_DIRS = ["assets", "css", "js"]

LOG_FILE = os.path.join(DEST_ROOT, "scripts/migration-run.log")
Map_FILE = os.path.join(DEST_ROOT, "scripts/resource-map.json")
REPORT_FILE = os.path.join(DEST_ROOT, "reports/migration-report.json")
VERIFY_LOG = os.path.join(DEST_ROOT, "scripts/archive-verify.log")

def log(msg):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(formatted + "\n")

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def calculate_checksum(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def step_1_copy_archive():
    log("=== STEP 1: IMMEDIATE COPY / ARCHIVE ===")
    
    # 1. Archive Content
    for d in SOURCE_DIRS:
        src = os.path.join(SOURCE_ROOT, d)
        dst = os.path.join(ARCHIVE_DIR, d)
        if os.path.exists(src):
            if os.path.exists(dst): shutil.rmtree(dst)
            shutil.copytree(src, dst)
            log(f"Archived {d} to {dst}")
        else:
            log(f"Warning: Source directory {d} not found.")

    # 2. Archive Assets
    for d in ASSET_DIRS:
        src = os.path.join(SOURCE_ROOT, d)
        dst = os.path.join(ASSETS_ARCHIVE_DIR, d)
        # Special handling for CSS/JS to multiple locations as per requirement 5 & 6
        if d == 'assets':
             if os.path.exists(dst): shutil.rmtree(dst)
             shutil.copytree(src, dst)
             log(f"Archived assets to {dst}")
        elif d == 'css':
             # Main legacy styles location
             if os.path.exists(CSS_ARCHIVE_DIR): shutil.rmtree(CSS_ARCHIVE_DIR)
             shutil.copytree(src, CSS_ARCHIVE_DIR)
             # Public location
             if os.path.exists(PUBLIC_CSS_ARCHIVE): shutil.rmtree(PUBLIC_CSS_ARCHIVE)
             shutil.copytree(src, PUBLIC_CSS_ARCHIVE)
             log(f"Archived css to {CSS_ARCHIVE_DIR} and {PUBLIC_CSS_ARCHIVE}")
        elif d == 'js':
             # Main legacy js location
             if os.path.exists(JS_ARCHIVE_DIR): shutil.rmtree(JS_ARCHIVE_DIR)
             shutil.copytree(src, JS_ARCHIVE_DIR)
             # Public location
             if os.path.exists(PUBLIC_JS_ARCHIVE): shutil.rmtree(PUBLIC_JS_ARCHIVE)
             shutil.copytree(src, PUBLIC_JS_ARCHIVE)
             log(f"Archived js to {JS_ARCHIVE_DIR} and {PUBLIC_JS_ARCHIVE}")

def step_2_verify_archive():
    log("=== STEP 2: VERIFY ARCHIVE ===")
    mismatches = []
    
    with open(VERIFY_LOG, "w", encoding="utf-8") as vlog:
        for d in SOURCE_DIRS + ASSET_DIRS:
            src_root = os.path.join(SOURCE_ROOT, d)
            
            # Determine dst_root based on logic in step 1
            if d in SOURCE_DIRS:
                dst_root = os.path.join(ARCHIVE_DIR, d)
            elif d == 'assets':
                 dst_root = os.path.join(ASSETS_ARCHIVE_DIR, 'assets')
            elif d == 'css':
                 dst_root = CSS_ARCHIVE_DIR
            elif d == 'js':
                 dst_root = JS_ARCHIVE_DIR
            
            if not os.path.exists(src_root): continue

            for root, dirs, files in os.walk(src_root):
                rel_path = os.path.relpath(root, src_root)
                dst_dir = os.path.join(dst_root, rel_path)
                
                for file in files:
                    src_file = os.path.join(root, file)
                    dst_file = os.path.join(dst_dir, file)
                    
                    if not os.path.exists(dst_file):
                        msg = f"MISSING: {dst_file}"
                        mismatches.append(msg)
                        vlog.write(msg + "\n")
                        continue
                    
                    src_hash = calculate_checksum(src_file)
                    dst_hash = calculate_checksum(dst_file)
                    
                    if src_hash != dst_hash:
                        msg = f"MISMATCH: {src_file} ({src_hash}) != {dst_file} ({dst_hash})"
                        mismatches.append(msg)
                        vlog.write(msg + "\n")
                    else:
                        vlog.write(f"OK: {file}\n")
    
    if mismatches:
        log("CRITICAL: Verification Failed!")
        for m in mismatches: log(m)
        exit(1)
    else:
        log("Verification Successful.")

def step_3_generate_map():
    log("=== STEP 3: LINK / RESOURCE MAP ===")
    resource_map = []
    
    for d in SOURCE_DIRS: # books, guides, protocols
        src_root = os.path.join(SOURCE_ROOT, d)
        if not os.path.exists(src_root): continue
        
        for file in os.listdir(src_root):
            if file.endswith(".html"):
                original_path = os.path.join(d, file).replace("\\", "/")
                archived_path = os.path.join("_archive/original_site", d, file).replace("\\", "/")
                
                # Naive asset scan
                with open(os.path.join(src_root, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                
                assets = re.findall(r'src=["\'](.*?)["\']', content)
                links = re.findall(r'href=["\'](.*?)["\']', content)
                
                resource_map.append({
                    "originalPath": original_path,
                    "archivedPath": archived_path,
                    "assets": assets,
                    "internalLinks": links
                })
    
    ensure_dir(os.path.dirname(Map_FILE))
    with open(Map_FILE, "w", encoding="utf-8") as f:
        json.dump(resource_map, f, indent=2)
    log(f"Resource map generated at {Map_FILE}")
    return resource_map

def step_4_safe_convert(resource_map):
    log("=== STEP 4: SAFE-CONVERTED CONTENT CREATION ===")
    
    for entry in resource_map:
        orig = entry["originalPath"] # e.g., books/atomic-habits.html
        slug = os.path.splitext(os.path.basename(orig))[0]
        category = os.path.dirname(orig) # books
        
        # Read Original HTML
        src_file = os.path.join(ARCHIVE_DIR, orig) # Correct path in archive
        with open(src_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        # Extract Body Content (Naive string op to avoid parsing issues if malformed)
        # Ideally we want everything inside <body>...</body>
        lower_html = html_content.lower()
        if "<body" in lower_html:
            start = lower_html.find("<body")
            start = lower_html.find(">", start) + 1
            end = lower_html.find("</body>")
            body_content = html_content[start:end]
        else:
            body_content = html_content # Fallback

        # Fix Assets Paths
        # Replace ../assets/ with /_archive_assets/assets/
        # Replace ../css/ with /_archive_assets/css/
        # Replace ../js/ with /_archive_assets/js/
        # Replace assets/ with /_archive_assets/assets/ (if relative)
        
        # We need to be careful with replacements. 
        # The prompt says: Replace asset URLs in MDX to point to `/public/_archive_assets/...`
        # Note: public assets are served at root `/` in Vite. So `/archive_assets/...`
        
        fixed_content = body_content
        fixed_content = fixed_content.replace('../assets/', '/_archive_assets/assets/')
        fixed_content = fixed_content.replace('assets/', '/_archive_assets/assets/')
        fixed_content = fixed_content.replace('../css/', '/_archive_assets/css/')
        fixed_content = fixed_content.replace('css/', '/_archive_assets/css/')
        fixed_content = fixed_content.replace('../js/', '/_archive_assets/js/')
        fixed_content = fixed_content.replace('js/', '/_archive_assets/js/')
        
        # Fix Internal Links to Router Paths (Optional/Requested)
        # "Convert internal links into React Router paths"
        # e.g. href="../books/deep-work.html" -> href="/books/deep-work.html" -> Link to="/books/deep-work"
        # For 'dangerouslySetInnerHTML', we can't easily use <Link>. We will rely on simple a tags for now,
        # but updated to point to the new route structure if possible, or keep them as is and rely on redirect/stub?
        # The mandate says "Convert internal links into React Router paths".
        # If we use dangerouslySetInnerHTML, standard <a> tags will cause full reload. 
        # Refactoring to <Link> is hard inside HTML string.
        # We will update href to point to the expected route `/books/deep-work` instead of `.html`
        
        def link_replacer(match):
            url = match.group(1)
            if url.startswith("http") or url.startswith("#"): return f'href="{url}"'
            
            # Simple conversion
            new_url = url.replace(".html", "")
            if new_url.startswith("../"): new_url = new_url[2:] # Remove ..
            if not new_url.startswith("/"): new_url = "/" + new_url
            
            # Clean up double slashes
            new_url = new_url.replace("//", "/")
            return f'href="{new_url}"'

        fixed_content = re.sub(r'href=["\'](.*?)["\']', link_replacer, fixed_content)

        # JSON Stringify for embedding
        safe_html_string = json.dumps(fixed_content)
        
        # Frontmatter
        mdx_content = f"""---
title: "{slug.replace('-', ' ').title()}"
original_path: "{orig}"
archived_path: "{entry['archivedPath']}"
date_migrated: "{datetime.date.today()}"
---

import React from 'react';
import LegacyPageWrapper from '../../components/LegacyPageWrapper';

{{/* 
    LEGACY CONTENT WRAPPER 
    This allows exact visual reproduction using the original HTML and CSS.
*/}}

<LegacyPageWrapper>
  <div 
    className="legacy-html-container"
    dangerouslySetInnerHTML={{ __html: {safe_html_string} }}
  />
</LegacyPageWrapper>
"""
        
        target_dir = os.path.join(DEST_ROOT, "src", category)
        ensure_dir(target_dir)
        target_file = os.path.join(target_dir, f"{slug}.mdx")
        
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(mdx_content)
        log(f"Created MDX stub: {target_file}")

def step_5_js_stubs(resource_map):
    log("=== STEP 5: JS STUBS ===")
    hook_dir = os.path.join(DEST_ROOT, "src/hooks")
    ensure_dir(hook_dir)
    
    for entry in resource_map:
        orig = entry["originalPath"]
        slug = os.path.splitext(os.path.basename(orig))[0]
        
        hook_file = os.path.join(hook_dir, f"use-migrated-{slug}.ts")
        
        # Identify JS references
        used_scripts = [s for s in entry.get("internalLinks", []) + entry.get("assets", []) if s.endswith(".js")]
        
        content = f"""/**
 * Migration Hook for: {slug}
 * Original Source: {orig}
 * 
 * Detected Legacy Scripts: {used_scripts}
 * 
 * Purpose: This hook is a stub for future refactoring of legacy JS logic.
 * Currently, legacy scripts are loaded via <script> tags in the detailed HTML 
 * or handled globally.
 */

import {{ useEffect }} from 'react';

export const useMigrated{slug.replace('-', '').title()} = () => {{
    useEffect(() => {{
        // TODO: Refactor legacy JS interactions here.
        // Selectors to watch: (Refer to original file)
    }}, []);
}};
"""
        with open(hook_file, "w", encoding="utf-8") as f:
            f.write(content)

def step_8_qa_report(resource_map):
    log("=== STEP 8: QA REPORT ===")
    report = {
        "generated_at": str(datetime.datetime.now()),
        "pages": []
    }
    
    for entry in resource_map:
        orig = entry["originalPath"]
        slug = os.path.splitext(os.path.basename(orig))[0]
        category = os.path.dirname(orig)
        
        mdx_path = os.path.join(DEST_ROOT, "src", category, f"{slug}.mdx")
        
        page_status = {
            "page": orig,
            "mdx_exists": os.path.exists(mdx_path),
            "checks": {
                "headings_preserved": "MANUAL_CHECK_REQUIRED",
                "images_load": "MANUAL_CHECK_REQUIRED"
            },
            "status": "PASS" if os.path.exists(mdx_path) else "FAIL"
        }
        report["pages"].append(page_status)
        
    ensure_dir(os.path.dirname(REPORT_FILE))
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    log(f"Report generated at {REPORT_FILE}")

def main():
    ensure_dir(os.path.dirname(LOG_FILE))
    log("Starting Migration...")
    
    step_1_copy_archive()
    step_2_verify_archive()
    resource_map = step_3_generate_map()
    step_4_safe_convert(resource_map)
    step_5_js_stubs(resource_map)
    step_8_qa_report(resource_map)
    
    log("Migration Script Complete.")

if __name__ == "__main__":
    main()
