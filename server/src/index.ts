import express from "express";

import { hello } from "./hello";

// console.log(hello());
// console.log("db url:", process.env.DATABASE_URL);

// Optional variables
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static("../client/dist/"));

app.get("/api/hello", (req: express.Request, res: express.Response) => {
  res.send({ message: "hello, world" });
});

app.listen(PORT, () =>
  console.log("Crunchspace server is listening at http://localhost:" + PORT)
);
