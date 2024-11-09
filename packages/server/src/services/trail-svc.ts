// server/src/services/trail-svc.ts
import { Schema, model } from "mongoose";
import { Trail } from "../models";

const Trails: Record<string, Trail> = {
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

const TrailSchema = new Schema<Trail>(
    {
      name: String,
      description: String,
      location: String
    },
    { collection: "trails_collection" }
  );

  const TrailModel = model<Trail>("Trail", TrailSchema);




// fetch all trails from the database
export function index(): Promise<Trail[]> {
    return TrailModel.find().exec();
  }
  
  export function getTrail(trailId: string): Promise<Trail> {
    return TrailModel.findOne({ name: trailId }).exec()
      .then((trail) => trail || {
        name: "Default Trail",
        description: "Default description",
        location: "Default location"
      });
  }

  export default { index, getTrail };
