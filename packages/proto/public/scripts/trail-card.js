import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class TrailCard extends HTMLElement {
  static template = html`
  <template>
    <div class="card">
      <h2 class="card-title"><slot name="title">Default Title</slot></h2>
      <p class="card-content"><slot name="content">Default Content</slot></p>
      <p class="card-content location">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.71 7 13 7 13s7-8.29 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <slot name="location">Default Location</slot>
      </p>
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

  .location {
    display: flex;
    align-items: center;
  }
  
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    fill: var(--color-link);
  }
`;

  constructor() {
    super();
    shadow(this)
      .template(TrailCard.template)
      .styles(TrailCard.styles);
  }
}