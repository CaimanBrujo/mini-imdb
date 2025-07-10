import dotenv from "dotenv";
dotenv.config();

import express from "express";
import indexRoutes from "./routes/index.js";
import genresRoutes from "./routes/genres.js";
import moviesRoutes from "./routes/movies.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/genres", genresRoutes);
app.use("/movies", moviesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
