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

**Redis added to the stack.** `redis:7` runs alongside `app` and `db` in `docker-compose.yml`. Confirmed working via a `/redis-ping` route that calls Redis's own `PING` command and returns the response.

## W4 · A1 — Auth: Login & Protect

### What This Project Is

This extends the Task API (Assignments 1-3) with user authentication. Previously, every endpoint was open to anyone. Now, signup/login is handled through **Supabase Auth** (an external Identity Provider), and specific routes require a valid, verified JWT (JSON Web Token) before returning data.

The task data itself (Postgres, Docker) is unchanged from Assignment 3 — this assignment adds an authentication layer on top of the same backend.

---

### Architecture

- **`routes/authRoutes.js`** — signup, login, logout (identity)
- **`routes/gateRoutes.js`** — public and protected example routes (access control)
- **`services/authService.js`** — validation, Supabase calls, token extraction/verification
- **`middleware/authMiddleware.js`** — reusable guard, verifies Bearer token before allowing a route to run
- **No repository layer for auth** — Supabase Auth itself is the data layer; there's no local `users` table to own.

---

### Setting Up Local Environment Variables

1. Copy `.env.example` to a new file named `.env`
2. Fill in your own values:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tasksdb
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

3. `SUPABASE_URL` and `SUPABASE_KEY` (anon/publishable key) are found in your Supabase Dashboard → Project Settings → API.
4. `.env` is gitignored and never committed. Never use the Supabase **service_role/secret key** here — only the anon/publishable key.

---

### How to Run It

1. Start Postgres + Redis in Docker:
```bash
docker compose up -d db redis
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node index.js
```

4. Server runs at `http://localhost:3000`. Interactive docs available at `http://localhost:3000/docs`.

---

### API Reference

| Method | Endpoint | Auth Required? | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Create a new user account |
| POST | `/auth/login` | No | Authenticate and receive access/refresh tokens |
| POST | `/auth/logout` | **Yes** (Bearer token) | Revoke the current session |
| GET | `/public/info` | No | Open endpoint, no restrictions |
| GET | `/protected/profile` | **Yes** (Bearer token) | Returns the verified user's own profile |
| GET | `/protected/dashboard` | **Yes** (Bearer token) | Example second protected route, uses same middleware |

**Existing task endpoints (Assignments 1-3, unchanged):** `GET/POST /tasks`, `GET/PUT/DELETE /tasks/:id`, `GET /stats` — no auth required currently.

---

### How Authentication Works

1. Client sends `email`/`password` to `/auth/signup` or `/auth/login`.
2. Supabase validates credentials and returns a JWT **access token** (short-lived) and **refresh token** (long-lived).
3. Client stores the access token and sends it on protected requests as:
   ```
   Authorization: Bearer <access_token>
   ```
4. `authMiddleware.js` extracts and verifies this token on every protected route:
   - **Format check** first (missing header, wrong scheme, empty token) — rejected locally, no network call, before anything else.
   - **Cryptographic/session verification** second — calls Supabase to confirm the token is real, unexpired, and tied to a live session.
5. If both checks pass, the route handler runs and the verified user's data (`req.user`) is available to it.

---

### Status Codes Used

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful login, successful profile read |
| 201 | Created | Successful signup |
| 204 | No Content | Successful logout |
| 400 | Bad Request | Missing/invalid email or password — never reached Supabase |
| 401 | Unauthorized | Missing/malformed/invalid/expired token, or wrong login credentials |

---

### Security Decisions Made

- **Generic error messages on signup/login** — never reveal whether a specific email is already registered, or whether a login failed due to wrong email vs wrong password. This prevents **user enumeration** (an OWASP-documented attack where an attacker learns which emails have accounts by reading differing error messages).
- **Only the Supabase anon/publishable key is used** throughout — the service_role/secret key (full admin access) is intentionally avoided everywhere except the one function that requires it (see note below).
- **`toSafeUser()` whitelist** — the client only ever receives `id`, `email`, `created_at` from Supabase's user object, never Supabase's raw internal user object (which could include unexpected fields in future SDK versions).
- **Bearer scheme parsing is case-insensitive** (`Bearer`, `bearer`, `BEARER` all accepted), matching RFC 7235 — but the token itself is treated as case-sensitive, since JWTs are.
- **Format validation happens before any network call** — malformed tokens are rejected instantly and locally, so Supabase is never queried with obvious garbage input.

---

### Known Limitation — Logout & JWTs

JWTs are **stateless** — a token stays cryptographically valid until its own expiry, regardless of "logout," unless the server explicitly revokes it. Our logout function calls `supabase.auth.admin.signOut(token, scope)`, which does correctly revoke that specific session server-side (verified by testing — reusing the same token after logout correctly returns 401).

For a real production app, this would typically be paired with **short-lived access tokens + refresh token rotation**, so that even an unrevoked leaked token expires quickly. That is intentionally out of scope for this assignment and is a planned next step before using this pattern on a real client project.

---

### Swagger UI

All endpoints are documented and testable at `/docs`, including protected routes (marked with a padlock icon). Click **Authorize**, paste a raw access token (no "Bearer " prefix needed), and test the full flow directly in the browser.

![Swagger UI with Bearer auth](swagger-auth-screenshot.png)

---

### Testing Performed

- ✅ Signup success → 201
- ✅ Signup with missing/invalid email or password → 400
- ✅ Signup with duplicate email → 400, generic message (no enumeration leak)
- ✅ Login success → 200 + access_token + refresh_token + user
- ✅ Login with wrong password → 401, generic message
- ✅ `/protected/profile` with no token → 401
- ✅ `/protected/profile` with malformed header → 401
- ✅ `/protected/profile` with valid token → 200 + real user data
- ✅ `/protected/profile` with tampered token → 401
- ✅ `/auth/logout` with valid token → 204
- ✅ Reusing the same token after logout on `/protected/profile` → 401 (confirms real revocation)
- ✅ `/public/info` always returns 200, regardless of auth
- ✅ Full flow tested via curl AND via Swagger UI "Try it out"

## Stage 7 — AI vs Me

### My Prompt

> "Write backend code for authentication flow: write code as layer architecture, write proper logical and secure code after checking and confirm it that its logical and secure. Create code for authentication flow using supabase for auth and use express. Write api endpoints for signup, login, logout, for authentication, use proper status codes where required at every point, for example: if user sends wrong credential at login then it should send 401 the invalid credential message back. Write routes for one public and one private info, the code should be structured and layered. Write swagger doc details for this code as well so I could test the apis with swagger and curl as well."

Deliberately kept vague on exact field names, exact status codes for every case, Bearer token format rules, logout revocation depth, and folder structure — to see what the AI would assume by default.

---

### What the AI Did Better

- Proactively documented its own known limitations in its README (logout only revokes the refresh token) without being asked — good transparency, even though the framing needed independent verification against Supabase's own docs before trusting it.

---

### What It Got Wrong or Quietly Ignored

1. **500 error instead of 400** — Login with a completely missing email field crashed with an uncaught 500 error instead of a controlled 400. Cause: no `typeof`/existence check before calling a string method on the missing field. My code checks `typeof email !== 'string'` first, so it never reaches that crash.

2. **Bearer scheme is case-sensitive** — Only accepted exact `Bearer`, rejected lowercase `bearer`. Not compliant with RFC 7235, which specifies the scheme name is case-insensitive. My code lowercases the scheme before comparing, so it accepts both.

3. **Logout returned 200 instead of 204** — The assignment spec asks for 204 ("No Content") on successful logout. The AI's version returned 200 with a response body instead.

4. **Logout created its own client/session handling differently than expected**, requiring correction to align with the simpler approach my code already used (single shared client, `admin.signOut(token, scope)` with the anon key).

5. **Over-modularized structure** — Without being told my actual folder layout, the AI split the code into more files/folders than my project uses (separate `controllers/`, `validators/`, `config/`, `docs/` folders, on top of `routes/` and `services/`). My project keeps auth logic in `routes/`, `services/`, `middleware/`, and `utils/` only — no controller or validator split, since validation lives directly inside the service functions.

---

### What My Prompt Forgot to Specify — What the AI Silently Decided For Me

- Exact request body field names (it guessed correctly, but this was luck, not specification).
- Bearer token parsing rules (case sensitivity) — AI silently chose case-sensitive matching, a real gap only found through curl testing.
- The exact status code for logout (204) — AI defaulted to 200.
- My exact folder/file structure — AI defaulted to a heavier, more "textbook" architecture than the project needed.

---

### Known Limitation — Both Versions Share This 

Access tokens issued by Supabase are stateless JWTs. Per Supabase's own documentation: **"Access Tokens of revoked sessions remain valid until their expiry time, encoded in the exp claim."** Calling `signOut()` (in any form — anon-key or admin) revokes the refresh token, but the already-issued access token itself cannot be server-side revoked before its natural expiry — this is a documented, fundamental property of stateless JWTs, not a bug in either my code or the AI's code.

**Mitigation approach used in this project:** logout revokes the refresh token so the session cannot be renewed going forward. The remaining access-token exposure window is accepted for this learning project and would be closed in a real production app by (a) setting a short JWT expiry in Supabase's Auth settings, and/or (b) adding a per-request session check against `auth.sessions` for sensitive operations — both are documented, standard approaches, and planned as a next step before using this pattern on a real client project.