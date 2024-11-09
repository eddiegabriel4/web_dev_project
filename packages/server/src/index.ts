// server/src/index.ts
import express, { Request, Response } from "express";
import { TrailPage } from "./pages/trail";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";

connect("cluster0");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("../proto/public"));

app.get("/trails/:trailId", (req: Request, res: Response) => {
  const { trailId } = req.params;

  Trails.getTrail(trailId).then((data) => {
    const page = new TrailPage(data);
    res
      .set("Content-Type", "text/html")
      .send(page.render());
  }).catch((err) => {
    res.status(404).send("Trail not found");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
