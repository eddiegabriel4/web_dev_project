// src/views/traveler-view.ts
import { View } from "@calpoly/mustang";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { Trail } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { state } from "lit/decorators.js";


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