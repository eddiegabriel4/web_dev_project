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
          <h2>Your Trips</h2>
        </header>
        <dl>${trailList}</dl>
      </main>
    `;
    }

    renderItem(trail: Trail) {
        return html`
      <div class="trail-item">
        <dt>${trail.name}</dt>
        <dd>${trail.description}</dd>
      </div>
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
                console.log("Fetched JSON:", json); // Log the raw JSON
                this.trailIndex = json || []; // Directly assign the array to trailIndex
                console.log("Updated trailIndex:", this.trailIndex);
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
