import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

export class TrailCard extends LitElement {
  @state() private mode: string = "view";
  @property({ type: String }) src: string = "";
  @state() private _user: Auth.User = new Auth.User();
  @state() private slots: Record<string, string> = {};

  private _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  static styles = css`
    :host {
      display: block;
      padding: var(--padding-default);
      max-width: 300px;
      background-color: var(--color-background-header);
      color: var(--color-text-default);
    }

    section.view {
      display: block;
    }

    :host([mode="edit"]) section.view {
      display: none;
    }

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

  connectedCallback(): void {
    super.connectedCallback();
    console.log("TrailCard connected to DOM");

    this._authObserver.observe(({ user }) => {
      console.log("Auth observer triggered:", user);
      
      if (user) {
        this._user = user;
      }

      if (user?.authenticated && this.src) {
        this.hydrate(this.src);
      }
    });

  }

  private hydrate(url: string): void {
    fetch(url, { headers: Auth.headers(this._user) })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch trail data: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Trail data fetched:", data);
        this.slots = data;
      })
      .catch((err) => console.error("Error fetching trail data:", err));
  }

  private handleEdit = (): void => {
    console.log("Switching to edit mode");
    this.mode = "edit";
};

  private submit(url: string, json: Record<string, any>): void {
    console.log("Submit: Sending PUT request to:", url);
    console.log("Submit: Payload being sent:", json);

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...Auth.headers(this._user),
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
        this.slots = updatedJson;
        this.mode = "view";
      })
      .catch((error) => {
        console.error("Submit: Error occurred while updating resource:", error);
      });
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const form = this.shadowRoot?.querySelector("mu-form");
    if (!form) {
        console.error("Form not found");
        return;
    }

    // Collect input values manually
    const detail: Record<string, string> = {};
    form.querySelectorAll("input").forEach((input) => {
        const name = input.name;
        const value = input.value;
        if (name) {
            detail[name] = value;
        }
    });

    // Use the submit method
    this.submit(this.src, detail);
}


  render() {

    const defaultLinks = [
        { href: "groups", text: "Hiking Groups" },
        { href: "gear", text: "Gear" },
        { href: "viewpoints", text: "Viewpoints" },
    ];

    return html`
        ${this.mode === "view"
            ? html`
                <!-- View Mode -->
                <section class="view">
                    <div class="card">
                        <h2 class="card-title">
                            <slot name="name">${this.slots.name || "Default Title"}</slot>
                        </h2>
                        <p class="card-content">
                            <slot name="description">${this.slots.description || "Default Content"}</slot>
                        </p>
                        <p class="card-content location">
                            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 4.71 7 13 7 13s7-8.29 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                />
                            </svg>
                            <slot name="location">${this.slots.location || "Default Location"}</slot>
                        </p>
                        <nav class="card-nav">
                            <slot name="nav">
                                <ul class="nav-list">
                                ${defaultLinks.map(
                                    (link) => html`
                                        <li>
                                            <a href="${link.href}">${link.text}</a>
                                        </li>
                                    `
                                )}
                                </ul>
                            </slot>
                        </nav>
                        <button @click=${this.handleEdit}>Edit</button>
                    </div>
                </section>
            `
            : html`
                <!-- Edit Mode -->
                <section class="edit">
                    <mu-form @mu-form:submit=${this.handleSubmit}>
                        <label>
                            <span>Trail Description</span>
                            <input
                                name="description"
                                .value=${this.slots.description || ""}
                                @input=${(e: Event) => (this.slots.description = (e.target as HTMLInputElement).value)}
                            />
                        </label>
                        <label>
                            <span>Location</span>
                            <input
                                name="location"
                                .value=${this.slots.location || ""}
                                @input=${(e: Event) => (this.slots.location = (e.target as HTMLInputElement).value)}
                            />
                        </label>
                        <button type="button" @click=${this.handleSubmit}>Save</button>
                    </mu-form>
                </section>
            `}
    `;
}


}
