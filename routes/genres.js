import express from "express";
import pool from "../db.js";
const router = express.Router();

// List all genres
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM genres ORDER BY name ASC");
    res.render("genres", { title: "Genres", genres: result.rows });
  } catch (err) {
    console.error("Error fetching genres:", err);
    res.status(500).send("Error loading genres");
  }
});

// Show form to create a new genre
router.get("/new", (req, res) => {
  res.render("genre_form", {
    title: "Create Genre",
    action: "/genres/new",
    genre: {},
    buttonText: "Create",
  });
});

// Handle creation of a new genre
router.post("/new", async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query("INSERT INTO genres (name, description) VALUES ($1, $2)", [
      name.trim(),
      description,
    ]);
    res.redirect("/genres");
  } catch (err) {
    console.error("Error creating genre:", err);
    res.status(500).send("Error creating genre");
  }
});

// Show form to edit a genre
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM genres WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Genre not found");
    }
    res.render("genre_form", {
      title: "Edit Genre",
      action: `/genres/${id}/edit`,
      genre: result.rows[0],
      buttonText: "Save Changes",
    });
  } catch (err) {
    console.error("Error loading genre:", err);
    res.status(500).send("Error loading genre");
  }
});

// Handle genre update
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query(
      "UPDATE genres SET name = $1, description = $2 WHERE id = $3",
      [name.trim(), description, id]
    );
    res.redirect("/genres");
  } catch (err) {
    console.error("Error updating genre:", err);
    res.status(500).send("Error updating genre");
  }
});

// Handle genre deletion
router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if there are movies associated with this genre
    const movies = await pool.query(
      "SELECT * FROM movies WHERE genre_id = $1",
      [id]
    );
    if (movies.rows.length > 0) {
      return res.send(
        "You cannot delete this genre because it has associated movies."
      );
    }

    await pool.query("DELETE FROM genres WHERE id = $1", [id]);
    res.redirect("/genres");
  } catch (err) {
    console.error("Error deleting genre:", err);
    res.status(500).send("Error deleting genre");
  }
});

export default router;
