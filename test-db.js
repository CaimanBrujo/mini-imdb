import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function test() {
  try {
    const dbName = await pool.query("SELECT current_database()");
    console.log("Connected to DB:", dbName.rows[0].current_database);

    const genres = await pool.query("SELECT * FROM genres ORDER BY name ASC");
    console.log("Genres:", genres.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

test();
