// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Trail } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "app/trails":
      findTrail(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    case "trail/save":
        saveTrail(message[1], user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function findTrail(
    msg: { trailID: string },
    user: Auth.User
  ) {
    return fetch(`/app/trails/${msg.trailID}`, {
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json();
        }
        return undefined;
      })
      .then((json: unknown) => {
        if (json) {
            console.log(json);
          return json as Trail;
        }
      });
  }


  function saveTrail(
    msg: {
      trailID: string;
      trail: Trail;
    },
    user: Auth.User
  ) {
    return fetch(`/api/trails/${msg.trailID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...Auth.headers(user),
      },
      body: JSON.stringify(msg.trail),
    })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        throw new Error(
          `Failed to save trail for ${msg.trailID}`
        );
      })
      .then((json: unknown) => json as Trail);
  }