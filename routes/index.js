import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "pg";
const router = express.Router();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

// Home route
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Connected to PostgreSQL! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("Error connecting to DB:", err);
    res.status(500).send("Error connecting to DB");
  }
});

router.get("/genres", async (req, res) => {
  try {
    console.log("Fetching genres...");
    const result = await pool.query(
      "SELECT * FROM public.genres ORDER BY name ASC"
    );
    console.log("Genres found:", result.rows.length);
    res.render("genres", { title: "Genres", genres: result.rows });
  } catch (err) {
    console.error("Error fetching genres:", err.stack || err);
    res.status(500).send("Error loading genres");
  }
});

export default router;
