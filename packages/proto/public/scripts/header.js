import {
    css,
    define,
    html,
    shadow,
    Dropdown,
    Events,
    Observer
  } from "@calpoly/mustang";
  import reset from "./styles/reset.css.js";
  import headings from "./styles/headings.css.js";
  
  export class HeaderElement extends HTMLElement {
    static uses = define({
      "mu-dropdown": Dropdown.Element
    });
  
    static template = html`<template>
      <header>
        <h1>PNW Hikes</h1>
        <nav>
          <mu-dropdown>
            <a slot="actuator">
              Hello,
              <span id="userid"></span>
            </a>
            <menu>
              <li>
                <label class="dark-mode-switch">
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
          </mu-dropdown>
        </nav>
      </header>
    </template>`;
  
    static styles = css`
      :host {
        display: contents;
      }
      header {
        display: flex;
        flex-wrap: wrap;
        align-items: bottom;
        justify-content: space-between;
        padding: var(--size-spacing-medium);
        background-color: var(--color-background-header);
        color: var(--color-text-inverted);
      }
      header ~ * {
        margin: var(--size-spacing-medium);
      }
      header p {
        --color-link: var(--color-link-inverted);
      }
      nav {
        display: flex;
        flex-direction: column;
        flex-basis: max-content;
        align-items: end;
      }
      a[slot="actuator"] {
        color: var(--color-link-inverted);
        cursor: pointer;
      }
      #userid:empty::before {
        content: "hiker";
      }
      menu a {
        color: var(--color-link);
        cursor: pointer;
        text-decoration: underline;
      }
      a:has(#userid:empty) ~ menu > .when-signed-in,
      a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
        display: none;
      }

      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  
  body {
      background-color: var(--color-background-page);
      color: var(--color-text-default);
      font-family: var(--font-family-body);
      font-size: var(--font-size-base);
      max-width: 1200px; 
      margin: 0 auto;
      padding: var(--padding-default);
  }
  
  header {
      display: flex; 
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-default);
      background-color: var(--color-background-header);
      color: var(--color-text-header);
      font-family: var(--font-family-heading);
  }
  
  header img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
  }
  
  .nav-list {
      display: flex; 
      gap: var(--padding-default); 
      list-style: none;
  }
  
  .nav-list a {
      text-decoration: none;
      color: var(--color-text-header);
      padding: var(--padding-small) var(--padding-default);
  }
  
  .card-container {
      display: grid; 
      grid-template-columns: repeat(3, 1fr);
      gap: var(--padding-default); 
      padding: var(--padding-default);
  }
  
  .card {
      border: 1px solid var(--color-link);
      border-radius: 8px;
      padding: var(--padding-default);
      background-color: var(--color-background-header);
      color: var(--color-text-default);
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
  
  a {
      color: var(--color-link);
      text-decoration: none;
      display: block;
      margin-top: var(--padding-large);
  }
  
  a:hover {
      color: var(--color-link-hover);
  }
  
  .trail-details {
      margin-bottom: var(--padding-large);
  }
  
  ul {
      margin-top: var(--padding-default);
  }
  
  svg.icon {
      display: inline;
      height: 20em; 
      width: 20em;
      vertical-align: middle;
      fill: currentColor; 
  }
  
    `;
  
    get userid() {
      return this._userid.textContent;
    }
  
    set userid(id) {
      if (id === "anonymous") {
        this._userid.textContent = "";
      } else {
        this._userid.textContent = id;
      }
    }
  
    constructor() {
      super();
      shadow(this)
        .template(HeaderElement.template)
        .styles(
          reset.styles,
          headings.styles,
          HeaderElement.styles
        );
  
      const dm = this.shadowRoot.querySelector(
        ".dark-mode-switch"
      );
  
      dm.addEventListener("click", (event) =>
        Events.relay(event, "dark-mode", {
          checked: event.target.checked
        })
      );
  
      this._userid = this.shadowRoot.querySelector("#userid");
      this._signout = this.shadowRoot.querySelector("#signout");
  
      this._signout.addEventListener("click", (event) =>
        Events.relay(event, "auth:message", ["auth/signout"])
      );
    }
  
    _authObserver = new Observer(this, "blazing:auth");
  
    connectedCallback() {
      this._authObserver.observe(({ user }) => {
        if (user && user.username !== this.userid) {
          this.userid = user.username;
        }
      });
    }
  
    static initializeOnce() {
      function toggleDarkMode(page, checked) {
        page.classList.toggle("dark-mode", checked);
      }
  
      document.body.addEventListener("dark-mode", (event) =>
        toggleDarkMode(event.currentTarget, event.detail.checked)
      );
    }
  }