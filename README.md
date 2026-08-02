# Task API

A simple CRUD (Create, Read, Update, Delete) API for managing a to-do list, built with Node.js and Express as part of the FlyRank Backend AI Engineering internship (Week 2, Assignment 1).

Tasks are stored in a SQLite database, and the API is fully documented and testable through an interactive Swagger UI page.
## How to run it

1. Clone this repository:
git clone https://github.com/laibaazhar135-oss/CRUD-task-api.git
cd CRUD-task-api

2. Install dependencies:
npm install

3. Start the server:
node --experimental-sqlite index.js

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

## Database

This project uses **SQLite** for data persistence, chosen because it requires no separate database server or installation — the entire database lives in a single file, making it simple for anyone cloning this repository to run the project immediately.

**Database file:** `data/tasks.db` — created automatically the first time the server runs. The `tasks` table is also created automatically if it doesn't exist, and 3 example tasks are inserted only if the table is empty.


### Exploring the database manually

The database can be opened and inspected directly using [DB Browser for SQLite](https://sqlitebrowser.org/).

![Database viewer showing the tasks table](db-screenshot.png)

Example query run directly against the database:

sql
SELECT * FROM tasks WHERE done = 1;

This returns only the tasks marked as completed — demonstrating that the API and the database always stay in sync, since the API reads directly from this same table.

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

- Data is stored in SQLite (`data/tasks.db`) and survives server restarts.
- `POST` and `PUT` validate that `title` is present and non-empty, returning `400` with a JSON error if not.
- Requesting a task that doesn't exist (`GET`, `PUT`, or `DELETE` on an invalid id) returns `404` with a JSON error.
-"Timestamps are stored in UTC."
## Mortality experiment
tasks are stored in a real SQLite database (see the Database section above), and data now correctly survives server restarts.

## AI vs me

**My prompt:** 
application back end developer to write code and also by junior developer. I want you to create a full product operations API. Create, write, update, and delete. The code should be in the node's highest environment with express framework. write the code for me so I can, uh, run that on a Versus code, a data, and the code should also, uh, provide... code for swagger UI interaction. The API the the API nucleate acquired operation API tool for managing a simple to do list for managing task. First create first create the endpoint with... get to get all the task and then and then the endpoint with get operation with a filter with a filter query to get only the task which are done. And then the post query to create a new task in already given task. And on the... and then create a put and then create a put endpoint. to update the task number two. remember, use status codes in every operation like in the put like in the put operation. If they want to update some some task that is not available in the memory, then don't... then response with the status code four zero four. That that is... and if someone in the post endpoint the client is sending empty request or missing requests, some then the represent a destructive code error is wrong with it. That bad request, four hundred error. And and after creating put and propose, creating the task successfully sent the status code two zero one created successfully. Also create a delete endpoint to delete. And after creating successful... after deleting success valid, and understood this code. Two zero four, no content. Means deleted successfully. And one thing I'm mentioning that you will not create any database. You will create an array of four tasks with property ID, title, and done, whether it's true or false. Okay? And the title will be, like, by the milk v y one. Okay. Then... so create three task in the memory in the given code and array of task with three objects with the properties I mentioned. Don't read a database yet. We don't need to... I'm not wanting you to create database. And after creating the code, mention with comments what's that specific endpoint is wrong. and what everything mentioned with the comments that order does work for. And I I think carefully before executing and flag anything that depends on assumptions and ask me about that before executing the plan. Eight five total endpoints, date, post, put, and create. And the five ones, I told you that that to get some specific task with the ID. 

**What the AI did better than my own code:**
1. Task id generation — used `Math.max(...ids) + 1`, which stays correct even after deleting the highest-id task and creating a new one. My own code used `tasks[length-1].id + 1`, which can reuse a deleted task's id in that exact scenario.

**What it got wrong or had to guess:**
1. I never specified what `done` should default to on PUT if omitted — the AI chose to default it to `false`; my own code leaves it as `undefined` in that case. Neither was explicitly correct or wrong, since I never specified it.

**What I learned about my own prompt:**
My prompt was messy (dictated, not written cleanly), which likely required more back-and-forth correction than a clearly written prompt would have. I also left the id-generation and done-default behavior unspecified — both turned out to be real ambiguities that produced different results between my code and the AI's.

## W3 · A1 — Postgres + Docker

### What changed from Assignment 2

The in-memory/SQLite storage was replaced with a real PostgreSQL database running in Docker. **The API's routes and business logic (services layer) did not change in behavior** — only a new repository file (`repositories/postgresTaskRepository.js`) was added, implementing the exact same functions (`findById`, `findall`, `create`, `update`, `del`, `getStats`) using Postgres instead of SQLite. `taskService.js` was updated to `async`/`await` since Postgres calls are asynchronous (network-based) unlike SQLite's synchronous calls — this was the only structural change required outside the repository layer, confirming the layered architecture worked as intended: swapping storage did not require rewriting any validation or routing logic.

The original SQLite repository (`taskRepository.js`) is kept in the repo intentionally, for comparison.

### How to run

```bash
docker compose up
```

This starts both the Postgres database and the Node app together, from a single command. On first run against a fresh volume, `db/init.sql` runs automatically, creating the `tasks` table and seeding 3 example tasks.

The API is available at `http://localhost:3000`, same endpoints as Assignment 1/2.

### Environment variables

Copy `.env.example` to `.env` and fill in your own values before running:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tasksdb
PORT=3000

`.env` is gitignored and never committed.

### Persistence proof

To confirm data survives a full restart, not just a pause:

1. Created a task via `POST /tasks` (`{"title":"Persistence test task"}`) → got back `id: 4`.
2. Ran `docker compose down` — this stops and removes both containers, but does **not** delete the named volume (`tasks-pgdata`).
3. Ran `docker compose up` again — fresh containers created.
4. `GET /tasks` showed all 4 tasks, including the one created before the restart — confirming data persisted independently of the containers' lifecycle.

### A real issue hit and resolved

While testing, the app returned `password authentication failed for user "postgres"` even after confirming `.env` and the container's `POSTGRES_PASSWORD` matched exactly. Running `netstat -ano | findstr :5432` revealed **two separate processes** listening on port 5432 — a native Postgres installation (from an earlier, unrelated Odoo workshop) was running as an auto-starting Windows service and intercepting the connection before it ever reached the Docker container. Uninstalling that native service resolved the issue immediately. Lesson: when a correctly-configured connection still fails auth, check for port conflicts with `netstat` before re-checking credentials.

### Endpoint table

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List all tasks (supports `?done=` and `?search=`) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/stats` | Task counts (total/done/open) |

### Stretch goals

**Redis added to the stack.** `redis:7` runs alongside `app` and `db` in `docker-compose.yml`. Confirmed working via a `/redis-ping` route that calls Redis's own `PING` command and returns the response: