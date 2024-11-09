import express, { Request, Response } from "express";
import Trails from "../services/trail-svc";
import { Trail } from "../models";

const router = express.Router();

router.get("/", (_, res: Response) => {
    Trails.index()
        .then((list: Trail[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:trailId", (req: Request, res: Response) => {
    Trails.getTrail(req.params.trailId)
        .then((trail: Trail) => res.json(trail))
        .catch((err) => res.status(404).send("Trail not found"));
});

router.put("/:trailId", (req: Request, res: Response) => {
    Trails.updateTrail(req.params.trailId, req.body)
        .then((trail: Trail) => res.json(trail))
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newTrail = req.body;

    Trails.createTrail(newTrail)
        .then((trail: Trail) => res.status(201).json(trail))
        .catch((err) => res.status(500).send(`Error creating trail: ${err.message || err}`));
});

router.delete("/:trailId", (req: Request, res: Response) => {
    const { trailId } = req.params;

    Trails.removeTrail(trailId)
        .then(() => res.status(204).end())
        .catch((err) => {
            console.error(`Error deleting trail with id ${trailId}:`, err);
            res.status(404).send(`Trail with id ${trailId} not found or could not be deleted.`);
        });
});






export { router as trails };
