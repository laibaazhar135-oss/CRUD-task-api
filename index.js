const express = require('express');
const app = express();
const port = 3000;

let tasks=[
  {id:1,title:"buy the milk",done:false},
  {id:2,title:"walk the dog",done:false},
  {id:3,title:"finish assignment",done:true}
];

app.get('/tasks',(req,res)=>{
res.json(tasks);
});

app.get('/tasks/:id',(req,res)=>{
const id=parseInt(req.params.id);
const task=tasks.find(t=> t.id===id);
if(!task){
  return res.status(404).json({error:`Task ${id} not found`});
}
res.json(task);
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});








