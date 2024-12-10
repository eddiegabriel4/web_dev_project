// server/src/pages/trail-page.ts
import { css, html } from "@calpoly/mustang/server";
import { Trail } from "../models";
import renderPage from "./renderPage";

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
            <trail-card src="/api/trails/${name}"></trail-card>
        `;
    }
}
