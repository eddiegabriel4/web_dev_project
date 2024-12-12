
import { Trail } from "server/models";

export type Msg =
  | ["app/trails", { trailID: string }]
  | [
    "trail/save",
    {
      trailID: string;
      trail: Trail;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }
  ];