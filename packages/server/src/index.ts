import express, { Request, Response } from "express";
import { TrailPage } from "./pages/trail";
import { connect } from "./services/mongo";
import Trails from "./services/trail-svc";
import { trails } from "./routes/trails";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage } from "./pages/auth";
import { RegistrationPage } from "./pages/auth"

connect("cluster0");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("../proto/public"));



app.use("/auth", auth);

// REST API routes
// app.use("/api/trails", trails); // used previously
app.use("/api/trails", authenticateUser, trails);

// HTML route for each trail card
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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
