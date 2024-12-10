import { Auth, Observer } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Trail } from "server/models";

export class HomeViewElement extends LitElement {
    src = "/api/trails";

    @state()
    trailIndex: Array<Trail> = [];

    render() {
        const trailList = this.trailIndex?.length
            ? this.trailIndex.map(this.renderItem)
            : html`<p>Loading trails...</p>`;

        return html`
        <main class="page">
        <header>
          <h1>Welcome to your center for all things trails in the Pacific Northwest</h1>
          <p>
            <a href="/trails.html" class="trails-link">Click here to see all trails</a>
          </p>
        </header>
      </main>
    `;
    }

    renderItem(trail: Trail) {
        return html`
      <trail-card 
          src="/api/trails/${trail.name}">
      </trail-card>
    `;
    }

    hydrate(url: string) {
        fetch(url, {
            headers: Auth.headers(this._user),
        })
            .then((res: Response) => {
                if (res.status === 200) return res.json();
                throw `Server responded with status ${res.status}`;
            })
            .then((json: Array<Trail>) => {
                this.trailIndex = json || [];
            })
            .catch((err) => console.error("Failed to fetch trail data:", err));
    }



    _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

    _user = new Auth.User();

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
            if (user) {
                this._user = user;
            }
            this.hydrate(this.src);
        });
    }
}
