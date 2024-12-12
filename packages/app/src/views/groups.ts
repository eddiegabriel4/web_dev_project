import { css, html, LitElement } from "lit";

export class GroupsView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--padding-default);
      font-family: Arial, sans-serif;
      color: var(--color-text-default);
      background-color: var(--color-background-page);
    }

    h1 {
      font-size: 1.8em;
      font-weight: bold;
      margin-bottom: var(--padding-default);
      text-align: center;
    }

    ul {
      padding: var(--padding-default);
      list-style-type: disc;
    }

    ul li {
      margin: var(--padding-small) 0;
    }

    a {
      display: inline-block;
      margin-top: var(--padding-default);
      text-decoration: none;
      color: var(--color-link);
    }

    a:hover {
      text-decoration: underline;
      color: var(--color-link-hover);
    }
  `;

  render() {
    return html`
      <h1>Upcoming Hiking Groups</h1>
      <ul>
        <li>15 people, hiking on 2025-01-15</li>
        <li>3 people, hiking on 2025-01-18</li>
        <li>7 people, hiking on 2025-01-22</li>      
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `;
  }
}