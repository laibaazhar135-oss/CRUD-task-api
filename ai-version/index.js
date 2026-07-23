

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -----------------------------------------------------------------------------
// "DATABASE" — a plain in-memory array. Explicitly required by the spec:
// no real database. Each task: { id: number, title: string, done: boolean }
// -----------------------------------------------------------------------------
let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Walk the dog', done: true },
  { id: 3, title: 'Read a book', done: false },
];

// =============================================================================
// SWAGGER / OPENAPI SETUP
// =============================================================================
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo Task API',
    version: '1.0.0',
    description: 'A simple in-memory CRUD API for managing tasks (id, title, done).',
  },
  servers: [{ url: `http://localhost:${PORT}`, description: 'Local dev server' }],
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Buy milk' },
          done: { type: 'boolean', example: false },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Buy milk' },
          done: { type: 'boolean', example: false },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Task not found' },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./index.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================================================================
// ROUTES  (5 endpoints total)
// =============================================================================

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks, optionally filtered by completion status
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: done
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: Filter tasks by done status ("true" or "false")
 *     responses:
 *       200:
 *         description: A list of tasks
 */
app.get('/tasks', (req, res) => {
  const { done } = req.query;

  if (done === undefined) {
    return res.status(200).json(tasks);
  }

  if (done !== 'true' && done !== 'false') {
    return res
      .status(400)
      .json({ error: "Query param 'done' must be 'true' or 'false'" });
  }

  const wantDone = done === 'true';
  const filtered = tasks.filter((t) => t.done === wantDone);
  return res.status(200).json(filtered);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested task
 *       404:
 *         description: Task not found
 */
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  return res.status(200).json(task);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing or invalid request body
 */
app.post('/tasks', (req, res) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or empty' });
  }

  const { title, done } = body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "'title' is required and must be a non-empty string" });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: "'done' must be a boolean if provided" });
  }

  const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;

  const newTask = {
    id: newId,
    title: title.trim(),
    done: done === undefined ? false : done,
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Task not found
 */
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or empty' });
  }

  const { title, done } = body;

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "'title' is required and must be a non-empty string" });
  }
  task.title = title.trim();

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: "'done' must be a boolean" });
    }
    task.done = done;
  }

  return res.status(200).json(task);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully (no content returned)
 *       404:
 *         description: Task not found
 */
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  tasks.splice(index, 1);
  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Todo API running at http://localhost:${PORT}`);
  console.log(`Swagger UI at    http://localhost:${PORT}/api-docs`);
});