import express, { Request, Response } from "express";
import { TrailPage } from "./pages/trail";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";
import { trails } from "./routes/trails";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import { RegistrationPage } from "./pages/auth"
import fs from "node:fs/promises";
import path from "path";

connect("cluster0");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//const staticDir = process.env.STATIC || path.resolve(__dirname, "../proto/public");

//app.use(express.static(staticDir));

app.use(express.static("../proto/public"));


app.use("/auth", auth);

app.use("/api/trails", authenticateUser, trails);

app.get("/trails/:trailId", (req: Request, res: Response) => {
  const { trailId } = req.params;

  Trails.getTrail(trailId)
    .then((data) => {
      const page = new TrailPage(data);
      res.set("Content-Type", "text/html").send(page.render());
    })
    .catch((err) => {
      res.status(404).send("Trail not found");
    });
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/register", (req: Request, res: Response) => {
  const page = new RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
