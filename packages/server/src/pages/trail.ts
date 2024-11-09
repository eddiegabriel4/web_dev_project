// server/src/pages/trail-page.ts
import { css, html } from "@calpoly/mustang/server";
import { Trail } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class TrailPage {
  data: Trail;

  constructor(data: Trail) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      styles: [
        css`
          main {
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
          }
        `
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { TrailElement } from "/scripts/trail-element.js";

        define({
          "trail-element": TrailElement
        });`
      ]
    });
  }

  renderBody() {
    const { name, description, location } = this.data;
    return html`
    <trail-card>
    <span slot="title">${name}</span>
    <span slot="content">${description}</span>
    <span slot="location">${location}</span>
    <nav slot="nav">
      <ul class="nav-list">
        <li><a href="groups.html">Hiking Groups</a></li>
        <li><a href="gear.html">Gear</a></li>
        <li><a href="viewpoints.html">Viewpoints</a></li>
      </ul>
    </nav>
  </trail-card>
    `;
  }
}
