// server/src/services/trail-svc.ts
import { Trail } from "../models";

const trails: Record<string, Trail> = {
  bearTrail: {
    name: "Bear Trail",
    description: "Hike near some dangerous little guys",
    location: "Glacier National Park"
  },
  graniteTrail: {
    name: "Granite Trail",
    description: "View the mighty granite peaks",
    location: "Grand Teton National Park"
  },
  forestTrail: {
    name: "Forest Trail",
    description: "Get lost in a serene forest",
    location: "Olympic National Park"
  }
};

export function getTrail(trailId: string): Trail {
  // Returns a trail based on the given trailId or a default trail
  return trails[trailId] || trails["forestTrail"];
}