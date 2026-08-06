const express = require('express');
const app = express();
const port = 3000;
const taskRoutes=require('./routes/taskRoutes');
const swaggerUi=require("swagger-ui-express");
const openapiDocument=require("./openapi.json");
const errorHandler=require('./middleware/errorHandler');
const {redisClient,connectRedis}=require('./db/redisConnection');
const supabase=require('./db/supabaseConnection');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: "Task Api", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/redis-ping',async(req,res)=>{
  await connectRedis();
  const result=await redisClient.ping();
   res.json({redis:result});
})
app.use(authRoutes);

app.use(taskRoutes);
app.use('/docs',swaggerUi.serve,swaggerUi.setup(openapiDocument));

app.use((req,res)=>{
  res.status(404).json({error:'Route not found'});
})

app.use(errorHandler);


app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try{
    const {error}=await supabase.auth.getSession();
    if(error) throw error;
    console.log('server running and connected to supabase');
  }
    catch(err){
        console.log('Failed to connect to supabse: ',err.message);
    }
});







