const express = require('express');
const app = express();
const port = 3000;
const taskRoutes=require('./routes/taskRoutes');
const swaggerUi=require("swagger-ui-express");
const openapiDocument=require("./openapi.json");
const errorHandler=require('./middleware/errorHandler');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: "Task Api", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.use(taskRoutes);

app.use('/docs',swaggerUi.serve,swaggerUi.setup(openapiDocument));

app.use((req,res)=>{
  res.status(404).json({error:'Route not found'});
})

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







