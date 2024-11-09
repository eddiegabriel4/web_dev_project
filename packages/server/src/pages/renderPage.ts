// server/src/pages/renderPage.ts
import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: [
    "/styles/reset.css",
    "/styles/tokens.css",
    "/styles/page.css"
  ],
  styles: [],
  scripts: [
    // including the dark mode toggle script
    `<script type="module" src="/scripts/dark-mode-toggle.js"></script>`,
    `import { define } from "@calpoly/mustang";
    import { HeaderElement } from "/scripts/header.js";

    define({
      "blz-header": HeaderElement
    });

    HeaderElement.initializeOnce();
    `
  ],
  googleFontURL:
  "https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Roboto:ital,wght@0,400;0,700;1,400&display=swap",
  imports: {
    "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
  }
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}
