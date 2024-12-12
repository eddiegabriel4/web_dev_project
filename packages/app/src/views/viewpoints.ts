import { css, html, LitElement } from "lit";

export class ViewpointsView extends LitElement {
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
      <h1>Viewpoints You Can See</h1>
      <ul>
         <li>Cliff View: Panoramic view of the valley</li>
        <li>Waterfall View: Cascading waterfalls</li>
        <li>Lake View: Peaceful lakeside spot</li>     
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `;
  }
}