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
  getTrail: () => getTrail
});
module.exports = __toCommonJS(trail_svc_exports);
const trails = {
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
function getTrail(trailId) {
  return trails[trailId] || trails["forestTrail"];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTrail
});
