import { css, html, shadow } from "@calpoly/mustang";
import { Observer, define, Form, InputArray } from "@calpoly/mustang";

export class TrailCard extends HTMLElement {

  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  _authObserver = new Observer(this, "blazing:auth");

  static template = html`
  <template>
    <!-- View section -->
    <section class="view">
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

        <button id="edit">Edit</button>
      </div>
    </section>

    <!-- Edit form -->
    <mu-form class="edit">
      <label>
        <span>Trail Description</span>
        <input name="description" />
      </label>
      <label>
        <span>Location</span>
        <input name="location" />
      </label>
    </mu-form>
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

  /* Ensure the view is only visible in "view" mode */
  section.view {
    display: block;
  }

  :host([mode="edit"]) section.view {
    display: none;
  }

  /* Ensure the form is only visible in "edit" mode */
  mu-form.edit {
    display: none;
  }

  :host([mode="edit"]) mu-form.edit {
    display: block;
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




get mode() {
  return this.getAttribute("mode") || "view";
}

set mode(m) {
  this.setAttribute("mode", m);
}


get editButton() {
  return this.shadowRoot.getElementById("edit");
}


  get src() {
    return this.getAttribute("src");
  }

  get authorization() {
    if (!this._user?.authenticated) {
      console.warn("Authorization requested but user is not authenticated.");
      return {};
    }
  
    console.log("Authorization header added:", `Bearer ${this._user.token}`);
    return {
      Authorization: `Bearer ${this._user.token}`,
    };
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }
  

  connectedCallback() {
    console.log("ConnectedCallback: src attribute:", this.src);
  
    this._authObserver.observe(({ user }) => {
      console.log("Updated user authentication state:", user);
      this._user = user;
  
      if (user?.authenticated) {
        console.log("Authenticated user detected. Fetching data...");
        if (this.src) {
          this.hydrate(this.src);
        }
      } else {
        console.warn("User is not authenticated. Skipping data fetch.");
      }
    });
  
    if (!this._user?.authenticated) {
      console.log("Waiting for user authentication before fetching data...");
    }
  }


  submit(url, json) {
    console.log("Submit: Sending PUT request to:", url);
    console.log("Submit: Payload being sent:", json);
  
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authorization,
      },
      body: JSON.stringify(json),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Submit: Server responded with status ${res.status}`);
          throw new Error(`Failed to update resource: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((updatedJson) => {
        console.log("Submit: Successfully updated resource:", updatedJson);
        this.renderSlots(updatedJson); 
        this.form.init = updatedJson;
        this.mode = "view";
      })
      .catch((error) => {
        console.error("Submit: Error occurred while updating resource:", error);
      });
  }
  
  
  
  

  hydrate(url) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }
  
    this._debounceTimeout = setTimeout(() => {
      console.log("Fetching data from:", url);
  
      fetch(url, {
        headers: {
          ...this.authorization,
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.error(`Hydrate: Server responded with status ${res.status}`);
            throw new Error(`Status: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          console.log("Hydrate: Successfully fetched data:", json);
          this.renderSlots(json);
          this.form.init = json; // populate mu-form
        })
        .catch((error) => {
          console.error(`Hydrate: Failed to fetch data from ${url}:`, error);
        });
    }, 300);
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

    this.addEventListener("mu-form:submit", (event) =>
      this.submit(this.src, event.detail)
    );

    this.editButton.addEventListener(
      "click",
      () => (this.mode = "edit")
    );
  }
}