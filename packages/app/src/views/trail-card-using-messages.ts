// src/views/traveler-view.ts
import { View } from "@calpoly/mustang";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { Trail } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { state } from "lit/decorators.js";
import { define, Form, History, InputArray } from "@calpoly/mustang";



export class TrailUsingMessagesViewElement extends View<Model, Msg> {
  @property()
  trailID?: string;

  @state()
  get trail(): Trail | undefined {
    return this.model.trail;
  }

  constructor() {
    super("blazing:model");
  }

  render() {
    const { trail } = this;

    return html`
      ${trail
        ? html`
            <div>
              <h1>${trail.name}</h1>
              <p>${trail.description}</p>
              <p>Location: ${trail.location}</p>
            </div>
          `
        : html`<p>Loading trail information...</p>`}
    `;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "userid" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "app/trails",
        { trailID: newValue }
      ]);
    }
  }
}


export class TrailEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
  });

  @property()
  trailID?: string;

  @state()
  get trail(): Trail | undefined {
    return this.model.trail;
  }

  render() {
    return html`
      <main class="page">
        <mu-form
          .init=${this.trail}
          @mu-form:submit=${this._handleSubmit}>
          <input name="name" type="text" placeholder="Trail Name" />
          <input name="description" type="text" placeholder="Description" />
          <input name="location" type="text" placeholder="Location" />
          <button type="submit">Save</button>
        </mu-form>
      </main>
    `;
  }

  _handleSubmit(event: Form.SubmitEvent<Trail>) {
    this.dispatchMessage([
      "trail/save",
      {
        trailID: this.trailID!,
        trail: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/trail/${this.trailID}`,
          }),
        onFailure: (error: Error) =>
          console.log("Error saving trail:", error),
      },
    ]);
  }
}
