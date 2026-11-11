# Portfolio

Live site: https://vishw094.github.io/Portfolio/

Plain HTML / CSS / JS — no build step. Edit `index.html` for content, `styles.css` for look, `script.js` for motion.

- Colors and fonts live at the top of `styles.css` (`:root`), with a dark theme block right below.
- Hero words cycle from the `data-words` attribute on each `.scramble-row` in `index.html`.
- Skills table rows use `data-domain` (`data`, `ml`, `ai`, `eng`) to work with the filter chips.

Preview locally: `python -m http.server 5173` then open http://localhost:5173
