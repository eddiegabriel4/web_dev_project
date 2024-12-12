// src/model.ts
import { Trail } from "server/models";

export interface Model {
  trail?: Trail;
}

export const init: Model = {};