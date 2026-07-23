# Task API

A simple CRUD (Create, Read, Update, Delete) API for managing a to-do list, built with Node.js and Express as part of the FlyRank Backend AI Engineering internship (Week 2, Assignment 1).

Tasks are stored in memory (no database yet ), and the API is fully documented and testable through an interactive Swagger UI page.

## How to run it

1. Clone this repository:
git clone https://github.com/laibaazhar135-oss/CRUD-task-api.git
cd CRUD-task-api

2. Install dependencies:
npm install

3. Start the server:
node index.js

4. The server runs at `http://localhost:3000`. Visit `http://localhost:3000/docs` in your browser for interactive API documentation (Swagger UI).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info — name, version, available endpoints |
| GET | `/health` | Health check — confirms the server is running |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get a single task by id |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

## Example request

Creating a new task:
curl.exe -i -X POST http://localhost:3000/tasks -H "Content-Type:application/json" -d "@body.json"

Response:
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40
ETag: W/"28-gPXr/tBcmKMXZwSEhav9o8e9gYc"
Date: Wed, 22 Jul 2026 12:42:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":5,"title":"Buy milk","done":false}

## Swagger UI

All endpoints can be tested interactively at `/docs` once the server is running:

![Swagger UI screenshot](swagger-screenshot.png)

## Notes

- Data is stored in memory and resets every time the server restarts — this is intentional for this stage
- `POST` and `PUT` validate that `title` is present and non-empty, returning `400` with a JSON error if not.
- Requesting a task that doesn't exist (`GET`, `PUT`, or `DELETE` on an invalid id) returns `404` with a JSON error.

## Mortality experiment

Restarting the server (`Ctrl+C`, then `node index.js`) resets the task list back to the original 3 example tasks — anything created, updated, or deleted before the restart is gone. This happens because tasks are stored only in memory (a plain JavaScript array), which exists only while the program is running. Nothing is written to disk. 