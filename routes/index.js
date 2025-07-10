import express from "express";
import pool from "../db.js";
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index", { title: "Mini IMDB" });
});

export default router;
