import { css, html, shadow } from "@calpoly/mustang";
import { Observer } from "@calpoly/mustang";

export class TrailCard extends HTMLElement {

  _authObserver = new Observer(this, "blazing:auth");

  static template = html`
  <template>
    <div class="card">
      <h2 class="card-title"><slot name="name">Default Title</slot></h2>
      <p class="card-content"><slot name="description">Default Content</slot></p>
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
            <li><a href="#">Default Link 3</a></li>
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

  get src() {
    return this.getAttribute("src");
  }

  // Getter for the Authorization header
  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  // connectedCallback() {
  //   if (this.src) this.hydrate(this.src);
  // }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      console.log("Updated user authentication state:", this._user);
    });

    if (this.src) this.hydrate(this.src);
  }

  hydrate(url) {
    console.log("Fetching data from:", url);
    fetch(url, {
      headers: {
        ...this.authorization
      }
    })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
      })
      .catch((error) =>
        console.log(`Failed to render data from ${url}:`, error)
      );
  }

  renderSlots(json) {

    const defaultLinks = [
      { href: "groups.html", text: "Hiking Groups" },
      { href: "gear.html", text: "Gear" },
      { href: "viewpoints.html", text: "Viewpoints" }
    ];

    const entries = Object.entries(json);
    const toSlot = ([key, value]) => html`<span slot="${key}">${value}</span>`;

    const fragment = entries.map(toSlot);

    // Inserting the current default links into the trail card
    if (!json.nav) {
      const navList = document.createElement("ul");
      navList.className = "nav-list";

      defaultLinks.forEach(link => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.text;
        li.appendChild(a);
        navList.appendChild(li);
      });

      const navSlot = document.createElement("nav");
      navSlot.setAttribute("slot", "nav");
      navSlot.appendChild(navList);

      fragment.push(navSlot);
    }

    this.replaceChildren(...fragment);
  }


  constructor() {
    super();
    shadow(this)
      .template(TrailCard.template)
      .styles(TrailCard.styles);
  }
}