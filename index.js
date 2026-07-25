const express = require('express');
const app = express();
const port = 3000;
const taskRoutes=require('./routes/taskRoutes');
const swaggerUi=require("swagger-ui-express");
const openapiDocument=require("./openapi.json");
app.use(express.json());

app.use(taskRoutes);
app.get('/', (req, res) => {
  res.json({ name: "Task Api", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});
app.use('/docs',swaggerUi.serve,swaggerUi.setup(openapiDocument));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







