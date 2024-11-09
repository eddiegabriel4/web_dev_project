"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var trail_svc_exports = {};
__export(trail_svc_exports, {
  default: () => trail_svc_default,
  getTrail: () => getTrail,
  index: () => index
});
module.exports = __toCommonJS(trail_svc_exports);
var import_mongoose = require("mongoose");
const Trails = {
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
const TrailSchema = new import_mongoose.Schema(
  {
    name: String,
    description: String,
    location: String
  },
  { collection: "trails_collection" }
);
const TrailModel = (0, import_mongoose.model)("Trail", TrailSchema);
function index() {
  return TrailModel.find().exec();
}
function getTrail(trailId) {
  return TrailModel.findOne({ name: trailId }).exec().then((trail) => trail || {
    name: "Default Trail",
    description: "Default description",
    location: "Default location"
  });
}
var trail_svc_default = { index, getTrail };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTrail,
  index
});
