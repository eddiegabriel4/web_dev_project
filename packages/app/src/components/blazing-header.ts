import { Dropdown, define, Events, Observer, Auth } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";

function toggleDarkMode(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const isChecked = target.checked;

    document.body.classList.toggle("dark-mode", isChecked);

    Events.relay(ev, "dark-mode", { checked: isChecked });
}

export class HeaderElement extends LitElement {
    @state() private userId: string = "hiker"; // default value for when user is not logged in

    private _user = new Auth.User();
    private _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

    static uses = define({
        "drop-down": Dropdown.Element,
    });

    connectedCallback(): void {
        super.connectedCallback();

        console.log("HeaderElement connected to the DOM.");

        this._authObserver.observe(({ user }) => {
            console.log("Auth observer triggered with user:", user);
            if (user) {
                this._user = user;
                this.loadUserId();
            }
        });

        this.loadUserId();
    }

    updated(): void {
        const signoutButton = this.shadowRoot?.querySelector("#signout");

        if (signoutButton) {
            signoutButton.addEventListener("click", this.handleSignOut);
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        const signoutButton = this.shadowRoot?.querySelector("#signout");
        if (signoutButton) {
            signoutButton.removeEventListener("click", this.handleSignOut);
        }
    }

    private loadUserId() {
        console.log("Loading user ID...");
        const user = this._user;
        if (user && user.username) {
            console.log("User found:", user.username);
            this.userId = user.username;
        } else {
            this.userId = "hiker";
        }
    }

    private handleSignOut = (event: Event): void => {
        event.preventDefault();
        Events.relay(event, "auth:message", ["auth/signout"]);
        this._user = new Auth.User();
        window.location.href = "/login";
    };

    render() {
        return html`
        <header>
          <h1>PNW Hikes</h1>
          <nav>
            <drop-down>
              <a slot="actuator">
                Hello,
                <span id="userid">${this.userId}</span>
              </a>
              <menu>
                <label @change=${toggleDarkMode}>
                  <input type="checkbox" autocomplete="off" />
                  Dark mode
                </label>
  
                <label class="when-signed-in">
                  <a id="signout">Sign Out</a>
                </label>
  
                <label class="when-signed-out">
                  <a href="/login">Sign In</a>
                </label>
              </menu>
            </drop-down>
          </nav>
        </header>
      `;
    }

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
  `;
}
