import express from "express";
import { Pool } from "pg";

import { hello } from "./hello";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("FATAL: At least one required environment variable is missing");
  process.exit(1);
}

// Optional variables
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.static("../client/dist/"));

const pgPool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // TODO Use SSL in production?
});

app.get("/api/hello", (req: express.Request, res: express.Response) => {
  res.send({ message: "hello, world" });
});

app.get("/api/high-score", async (req, res) => {
  try {
    // await fakeNetworkDelay();
    const { rows: highScores } = await pgPool.query(`
        SELECT player, score
        FROM high_score
        ORDER BY score DESC
        LIMIT 10
      `);
    res.send(highScores);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.post("/api/high-score", async (req, res) => {
  console.log("Received high score");
  const { player, score } = req.body;
  try {
    // await fakeNetworkDelay();
    await pgPool.query(
      `
        INSERT INTO high_score(player, score, created_at)
        VALUES ($1, $2, current_timestamp)
      `,
      [player, score]
    );
    console.log("Successfully saved high score");
    res.send("{}");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get("/api/score", async (req, res) => {
  try {
    // await fakeNetworkDelay();
    const { rows: scores } = await pgPool.query(`
        SELECT player, score, created_at
        FROM score
        ORDER BY created_at DESC
        LIMIT 5
      `);
    res.send(scores);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get("/api/score-count", async (req, res) => {
  try {
    // await fakeNetworkDelay();
    const { rows } = await pgPool.query(`
        SELECT count(*)
        FROM score
      `);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.post("/api/score", async (req, res) => {
  console.log("Received score");
  const { player, score } = req.body;
  try {
    // await fakeNetworkDelay();
    await pgPool.query(
      `
        INSERT INTO score(player, score, created_at)
        VALUES ($1, $2, current_timestamp)
      `,
      [player, score]
    );
    console.log("Successfully saved score");
    res.send("{}");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.listen(PORT, () =>
  console.log("Crunchspace server is listening at http://localhost:" + PORT)
);
