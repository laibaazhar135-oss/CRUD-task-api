const express = require('express');
const app = express();
const port = 3000;
const swaggerUi=require("swagger-ui-express");
const openapiDocument=require("./openapi.json");
app.use(express.json());

let tasks=[
  {id:1,title:"buy the milk",done:false},
  {id:2,title:"walk the dog",done:false},
  {id:3,title:"finish assignment",done:true}
];



app.get('/tasks',(req,res)=>{
 let result =tasks;
 let doneFilter= req.query.done==='true';
 if(req.query.done!==undefined){
  result= result.filter(t=> t.done===doneFilter);
 }

 if(req.query.search){
  let term=req.query.search.toLowerCase();
  result=result.filter(t=> t.title.toLowerCase().includes(term));
 }

 res.json(result);
});

app.get('/stats',(req,res)=>{
let total=tasks.length;
let done=tasks.filter(t=> t.done).length;
res.json({total,done,open:total-done});
});

app.post('/reset',(req,res)=>{
 tasks=[
     { id: 1, title: "Buy milk", done: false },
    { id: 2, title: "Walk the dog", done: false },
    { id: 3, title: "Finish assignment", done: true }
 ]
 res.json({message:`tasks reset`,tasks})
});

app.get('/tasks/:id',(req,res)=>{
const id=parseInt(req.params.id);
const task=tasks.find(t=> t.id===id);
if(!task){
  return res.status(404).json({error:`Task ${id} not found`});
}
res.json(task);
});

app.post('/tasks',(req,res)=>{
 const {title}=req.body;

 if(!title || title.trim()===''){
  return res.status(400).json({error:"title is required"});
 }
 const newTask={
  id:tasks.length>0?tasks[tasks.length-1].id+1:1,
  title:title,
  done:false
 }
 tasks.push(newTask);
 res.status(201).json(newTask);
});


app.put('/tasks/:id',(req,res)=>{
  const id=parseInt(req.params.id);
  const task=tasks.find(t=> t.id=== id);
  if(!task){
    return res.status(404).json({error:`Task ${id} not found`});
  }
  const {title,done}=req.body;
  if(!title || title.trim()===''){
    return res.status(400).json({error:"Title is required"});
  }
  task.title=title;
  task.done=done;
  res.json(task);
});

app.delete('/tasks/:id',(req,res)=>{
 const id=parseInt(req.params.id);
 const index=tasks.findIndex(t=> t.id===id);
 if(index=== -1){
  return res.status(404).json({error:`Task ${id} not found`});
 }
 tasks.splice(index,1);
 res.status(204).send();
});


app.get('/',(req,res)=>{
  res.json({
    name:"Task Api",
    version:"1.0",
    endpoints:["/tasks"]
  })
});

app.get('/health',(req,res)=>{
 res.json({
  status:"ok"
 })
});

app.use('/docs',swaggerUi.serve,swaggerUi.setup(openapiDocument));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







