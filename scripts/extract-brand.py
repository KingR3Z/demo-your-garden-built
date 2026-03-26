#!/usr/bin/env python3
"""
Extract brand identity from any website URL.
Outputs colors, fonts, logos, spacing, and personality as JSON.

Usage: python3 extract-brand.py https://example.com
Output: brand.json in current directory

Requires: pip install playwright && playwright install chromium
"""

import json
import sys
import os
import re
from collections import Counter

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: playwright not installed. Run: pip install playwright && playwright install chromium")
    sys.exit(1)


def extract_brand(url: str) -> dict:
    """Extract brand identity from a website."""
    brand = {
        "url": url,
        "colors": {"primary": [], "background": [], "accent": [], "text": []},
        "typography": {"headings": "", "body": "", "sizes": {}},
        "logo": {"url": "", "alt": ""},
        "buttons": {"background": "", "text": "", "borderRadius": "", "fontWeight": ""},
        "spacing": {"sectionPadding": "", "containerMax": ""},
        "personality": {"description": "", "keywords": []},
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        try:
            page.goto(url, wait_until="networkidle", timeout=15000)
        except Exception as e:
            print(f"Warning: Page load issue: {e}")
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=10000)
            except Exception:
                print(f"ERROR: Could not load {url}")
                browser.close()
                return brand

        # Extract computed styles via JavaScript
        data = page.evaluate("""() => {
            const result = {
                colors: [],
                fonts: [],
                headingFont: '',
                bodyFont: '',
                logo: { url: '', alt: '' },
                buttons: [],
                meta: { description: '', ogDescription: '', title: '' },
                spacing: {},
            };

            // Get all computed colors from visible elements
            const colorCount = {};
            const elements = document.querySelectorAll('*');
            const seen = new Set();

            for (let i = 0; i < Math.min(elements.length, 500); i++) {
                const el = elements[i];
                const style = getComputedStyle(el);

                // Skip invisible elements
                if (style.display === 'none' || style.visibility === 'hidden') continue;

                // Collect background colors
                const bg = style.backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    colorCount[bg] = (colorCount[bg] || 0) + 1;
                }

                // Collect text colors
                const color = style.color;
                if (color && !seen.has('color:' + color)) {
                    seen.add('color:' + color);
                    result.colors.push({ type: 'text', value: color, tag: el.tagName });
                }
            }

            // Sort background colors by frequency
            const sortedBg = Object.entries(colorCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            sortedBg.forEach(([color, count]) => {
                result.colors.push({ type: 'background', value: color, count });
            });

            // Heading font
            const h1 = document.querySelector('h1');
            if (h1) result.headingFont = getComputedStyle(h1).fontFamily;

            // Body font
            result.bodyFont = getComputedStyle(document.body).fontFamily;

            // Font sizes
            ['h1', 'h2', 'h3', 'p', 'a'].forEach(tag => {
                const el = document.querySelector(tag);
                if (el) {
                    const s = getComputedStyle(el);
                    result.fonts.push({
                        tag,
                        family: s.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
                        size: s.fontSize,
                        weight: s.fontWeight,
                        lineHeight: s.lineHeight,
                    });
                }
            });

            // Logo
            const logoSelectors = [
                'header img[src*="logo"]', 'nav img[src*="logo"]',
                'header img[alt*="logo"]', 'nav img[alt*="logo"]',
                'header img', '.logo img', '#logo img',
                'a[href="/"] img', 'header svg',
            ];
            for (const sel of logoSelectors) {
                const logoEl = document.querySelector(sel);
                if (logoEl) {
                    result.logo = {
                        url: logoEl.src || logoEl.getAttribute('data-src') || '',
                        alt: logoEl.alt || '',
                    };
                    break;
                }
            }

            // Buttons
            const btns = document.querySelectorAll('button, a.btn, .button, [class*="btn"], [class*="cta"]');
            for (let i = 0; i < Math.min(btns.length, 5); i++) {
                const s = getComputedStyle(btns[i]);
                result.buttons.push({
                    text: btns[i].textContent?.trim().substring(0, 30),
                    background: s.backgroundColor,
                    color: s.color,
                    borderRadius: s.borderRadius,
                    fontWeight: s.fontWeight,
                    padding: s.padding,
                });
            }

            // Meta
            const metaDesc = document.querySelector('meta[name="description"]');
            const ogDesc = document.querySelector('meta[property="og:description"]');
            result.meta.description = metaDesc?.content || '';
            result.meta.ogDescription = ogDesc?.content || '';
            result.meta.title = document.title;

            // Spacing
            const main = document.querySelector('main') || document.querySelector('section') || document.body;
            if (main) {
                const s = getComputedStyle(main);
                result.spacing.padding = s.padding;
                result.spacing.maxWidth = s.maxWidth;
            }

            return result;
        }""")

        browser.close()

    # Process extracted data
    def rgb_to_hex(rgb_str):
        match = re.findall(r'\d+', rgb_str)
        if len(match) >= 3:
            r, g, b = int(match[0]), int(match[1]), int(match[2])
            return f"#{r:02x}{g:02x}{b:02x}"
        return rgb_str

    # Colors
    bg_colors = [c for c in data["colors"] if c["type"] == "background"]
    text_colors = [c for c in data["colors"] if c["type"] == "text"]

    brand["colors"]["background"] = [rgb_to_hex(c["value"]) for c in bg_colors[:3]]
    brand["colors"]["text"] = list(set([rgb_to_hex(c["value"]) for c in text_colors[:5]]))

    # Determine primary/accent from button colors
    if data["buttons"]:
        btn = data["buttons"][0]
        brand["colors"]["primary"] = [rgb_to_hex(btn["background"])]
        brand["buttons"] = {
            "background": rgb_to_hex(btn["background"]),
            "text": rgb_to_hex(btn["color"]),
            "borderRadius": btn["borderRadius"],
            "fontWeight": btn["fontWeight"],
        }

    # Typography
    brand["typography"]["headings"] = data.get("headingFont", "").split(",")[0].strip().strip("'\"")
    brand["typography"]["body"] = data.get("bodyFont", "").split(",")[0].strip().strip("'\"")
    for f in data.get("fonts", []):
        brand["typography"]["sizes"][f["tag"]] = {
            "size": f["size"],
            "weight": f["weight"],
        }

    # Logo
    brand["logo"] = data.get("logo", {})

    # Personality
    desc = data.get("meta", {}).get("description", "") or data.get("meta", {}).get("ogDescription", "")
    brand["personality"]["description"] = desc
    brand["personality"]["title"] = data.get("meta", {}).get("title", "")

    return brand


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract-brand.py https://example.com")
        sys.exit(1)

    url = sys.argv[1]
    if not url.startswith("http"):
        url = "https://" + url

    print(f"Extracting brand identity from {url}...")
    brand = extract_brand(url)

    output_file = "brand.json"
    with open(output_file, "w") as f:
        json.dump(brand, f, indent=2)

    print(f"\nSaved to {output_file}")
    print(f"\nBrand Summary:")
    print(f"  Background colors: {brand['colors']['background']}")
    print(f"  Primary color: {brand['colors']['primary']}")
    print(f"  Heading font: {brand['typography']['headings']}")
    print(f"  Body font: {brand['typography']['body']}")
    print(f"  Logo: {brand['logo'].get('url', 'Not found')[:60]}")
    print(f"  Description: {brand['personality']['description'][:80]}...")
