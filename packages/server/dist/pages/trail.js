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
var trail_exports = {};
__export(trail_exports, {
  TrailPage: () => TrailPage
});
module.exports = __toCommonJS(trail_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class TrailPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      styles: [
        import_server.css`
          main {
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
          }
        `
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { TrailElement } from "/scripts/trail-element.js";

        define({
          "trail-element": TrailElement
        });`
      ]
    });
  }
  renderBody() {
    const { name, description, location } = this.data;
    return import_server.html`
    <trail-card>
    <span slot="title">${name}</span>
    <span slot="content">${description}</span>
    <span slot="location">${location}</span>
    <nav slot="nav">
      <ul class="nav-list">
        <li><a href="groups.html">Hiking Groups</a></li>
        <li><a href="gear.html">Gear</a></li>
        <li><a href="viewpoints.html">Viewpoints</a></li>
      </ul>
    </nav>
  </trail-card>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrailPage
});
