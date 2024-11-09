// server/src/index.ts
import express, { Request, Response } from "express";
import { getTrail } from "./services/trail-svc";
import { TrailPage } from "./pages/trail";

const app = express();
const port = process.env.PORT || 3000;

const staticDir = "../proto/public";
app.use(express.static(staticDir));

app.get("/trails/:trailId", (req: Request, res: Response) => {
  const { trailId } = req.params;
  const trail = getTrail(trailId);

  if (trail) {
    const page = new TrailPage(trail);
    res.set("Content-Type", "text/html").send(page.render());
  } else {
    res.status(404).send("Trail not found");
  }
});

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
