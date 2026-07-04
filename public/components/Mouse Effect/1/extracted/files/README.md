# Mouse Image Distortion

## ⚠️ How to run

You **cannot** open `index.html` directly by double-clicking it.
Browsers block image/texture loading from `file://` URLs (CORS), and ES
modules also require an HTTP origin.

You **must** serve the folder over HTTP. Pick whichever you have:

```bash
# Option 1 — Python (built-in on macOS / Linux)
cd /path/to/this/folder
python3 -m http.server 8080

# Option 2 — Node
npx serve

# Option 3 — VS Code
# install the "Live Server" extension, right-click index.html → Open with Live Server
```

Then open in your browser:

```
http://localhost:8080
```

## What it does

Hovering each list item swaps a Three.js shader plane's texture and
fades it in. The plane follows the cursor with smoothing (`lerp 0.1`),
and its vertices are displaced based on the mouse delta — giving the
"flag in the wind" distortion as you move quickly between rows.

## Stack

- Three.js r160 (loaded as ES module via `<script type="importmap">`)
- GSAP 3.13 (alpha tweens)
- Lenis 1.0.42 (smooth scroll)

No build step, no bundler, no `npm install`.
