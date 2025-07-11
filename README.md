# mini-imdb

A minimal IMDb-like app to manage movies and genres. Built with **Node.js**, **Express**, and **PostgreSQL**, deployed on **Railway**.

## Live Preview

https://mini-imdb-production-c55d.up.railway.app/

⚠️ **Note:**  
This deployment is hosted on Railway and **might be deleted in the near future**.

## Features

- CRUD for **Genres** (create, edit, delete with admin password)
- CRUD for **Movies** (linked to genres)
- EJS templating for rendering views
- PostgreSQL database hosted in Railway

## Tech Stack

- Backend: Node.js, Express
- Database: PostgreSQL
- Views: EJS
- Deployment: Railway

## Environment Variables

This app requires the following environment variables: .env

```
| Variable          | Description                            |
|-------------------|----------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string           |
| `ADMIN_PASSWORD`  | Password required for admin operations |
```
