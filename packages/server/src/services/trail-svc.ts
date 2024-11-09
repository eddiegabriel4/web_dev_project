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


export function createTrail(json: Trail): Promise<Trail> {
    const newTrail = new TrailModel(json);
    return newTrail.save();
}


// fetch all trails from the database
export function index(): Promise<Trail[]> {
    return TrailModel.find().exec();
}

export function getTrail(trailId: string): Promise<Trail> {
    const decodedTrailId = decodeURIComponent(trailId);
    return TrailModel.findOne({ name: decodedTrailId }).exec()
        .then((trail) => trail || {
            name: "Default Trail",
            description: "Default description",
            location: "Default location"
        });
}

export function updateTrail(trailId: string, trail: Trail): Promise<Trail> {
    const decodedTrailId = decodeURIComponent(trailId);
    return TrailModel.findOneAndUpdate({ name: decodedTrailId }, trail, { new: true })
        .then((updatedTrail) => {
            if (!updatedTrail) throw `${decodedTrailId} not updated`;
            return updatedTrail;
        });
}

export function removeTrail(trailId: string): Promise<void> {
    const decodedTrailId = decodeURIComponent(trailId);
    return TrailModel.findOneAndDelete({ name: decodedTrailId }).then((deletedTrail) => {
        if (!deletedTrail) throw `${decodedTrailId} not deleted`;
    });
}



export default { index, getTrail, createTrail, updateTrail, removeTrail };
