"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var trails_exports = {};
__export(trails_exports, {
  trails: () => router
});
module.exports = __toCommonJS(trails_exports);
var import_express = __toESM(require("express"));
var import_trail_svc = __toESM(require("../services/trail-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_trail_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:trailId", (req, res) => {
  import_trail_svc.default.getTrail(req.params.trailId).then((trail) => res.json(trail)).catch((err) => res.status(404).send("Trail not found"));
});
router.put("/:trailId", (req, res) => {
  import_trail_svc.default.updateTrail(req.params.trailId, req.body).then((trail) => res.json(trail)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newTrail = req.body;
  import_trail_svc.default.createTrail(newTrail).then((trail) => res.status(201).json(trail)).catch((err) => res.status(500).send(`Error creating trail: ${err.message || err}`));
});
router.delete("/:trailId", (req, res) => {
  const { trailId } = req.params;
  import_trail_svc.default.removeTrail(trailId).then(() => res.status(204).end()).catch((err) => {
    console.error(`Error deleting trail with id ${trailId}:`, err);
    res.status(404).send(`Trail with id ${trailId} not found or could not be deleted.`);
  });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  trails
});
