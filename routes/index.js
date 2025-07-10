import express from "express";
import pool from "../db.js";
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index", { title: "Mini IMDB" });
});

// Genres route
router.get("/genres", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.genres ORDER BY name ASC"
    );
    res.render("genres", { title: "Genres", genres: result.rows });
  } catch (err) {
    console.error("Error fetching genres:", err);
    res.status(500).send("Error loading genres");
  }
});

export default router;
