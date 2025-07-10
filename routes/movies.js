import express from "express";
import pool from "../db.js";
const router = express.Router();

// List all movies
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT movies.id, movies.title, movies.release_year, genres.name AS genre_name FROM movies JOIN genres ON movies.genre_id = genres.id ORDER BY movies.title ASC`
    );
    res.render("movies", { title: "Movies", movies: result.rows });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Error loading movies");
  }
});

// Show form to create a new movie
router.get("/new", async (req, res) => {
  try {
    const genres = await pool.query("SELECT * FROM genres ORDER BY name ASC");
    res.render("movie_form", {
      title: "Create Movie",
      action: "/movies/new",
      movie: {},
      genres: genres.rows,
      buttonText: "Create",
    });
  } catch (err) {
    console.error("Error loading genres:", err);
    res.status(500).send("Error loading form");
  }
});

// Handle creation of a new movie (requires admin password)
router.post("/new", async (req, res) => {
  const { title, release_year, genre_id, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res
      .status(403)
      .send("Invalid admin password. You are not authorized to create.");
  }

  try {
    await pool.query(
      "INSERT INTO movies (title, release_year, genre_id) VALUES ($1, $2, $3)",
      [title.trim(), release_year, genre_id]
    );
    res.redirect("/movies");
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).send("Error creating movie");
  }
});

// Show form to edit a movie
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const movieResult = await pool.query("SELECT * FROM movies WHERE id = $1", [
      id,
    ]);
    if (movieResult.rows.length === 0) {
      return res.status(404).send("Movie not found");
    }
    const genresResult = await pool.query(
      "SELECT * FROM genres ORDER BY name ASC"
    );
    res.render("movie_form", {
      title: "Edit Movie",
      action: `/movies/${id}/edit`,
      movie: movieResult.rows[0],
      genres: genresResult.rows,
      buttonText: "Save Changes",
    });
  } catch (err) {
    console.error("Error loading movie:", err);
    res.status(500).send("Error loading movie");
  }
});

// Handle movie update (requires admin password)
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { title, release_year, genre_id, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res
      .status(403)
      .send("Invalid admin password. You are not authorized to edit.");
  }

  try {
    await pool.query(
      "UPDATE movies SET title = $1, release_year = $2, genre_id = $3 WHERE id = $4",
      [title.trim(), release_year, genre_id, id]
    );
    res.redirect("/movies");
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).send("Error updating movie");
  }
});

// Handle movie deletion (requires admin password)
router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;
  const { adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res
      .status(403)
      .send("Invalid admin password. You are not authorized to delete.");
  }

  try {
    await pool.query("DELETE FROM movies WHERE id = $1", [id]);
    res.redirect("/movies");
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).send("Error deleting movie");
  }
});

export default router;
