import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class TrailCard extends HTMLElement {
    static template = html`
      <template>
        <div class="card">
          <h2 class="card-title"><slot name="title">Default Title</slot></h2>
          <p class="card-content"><slot name="content">Default Content</slot></p>
          <nav class="card-nav">
            <slot name="nav">
              <ul class="nav-list">
                <li><a href="#">Default Link 1</a></li>
                <li><a href="#">Default Link 2</a></li>
              </ul>
            </slot>
          </nav>
        </div>
      </template>
    `;

  static styles = css`
  :host {
    display: block;
    padding: var(--padding-default);
    max-width: 300px;
    background-color: var(--color-background-header);
    color: var(--color-text-default);
  }

  .card {
    border: 1px solid var(--color-link);
    border-radius: 8px;
    padding: var(--padding-default);
    transition: transform 0.2s;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card-title {
    font-family: var(--font-family-heading);
    font-size: var(--font-size-large);
    margin-bottom: var(--padding-small);
  }

  .card-content {
    font-family: var(--font-family-body);
    font-size: var(--font-size-base);
  }

  .card-nav .nav-list {
    display: flex;
    gap: var(--padding-default);
    list-style: none;
    padding: 0;
  }

  .card-nav .nav-list a {
    text-decoration: none;
    color: var(--color-link);
    padding: var(--padding-small) var(--padding-default);
  }

  .card-nav .nav-list a:hover {
    color: var(--color-link-hover);
  }
`;

  constructor() {
    super();
    shadow(this)
      .template(TrailCard.template)
      .styles(TrailCard.styles);
  }
}