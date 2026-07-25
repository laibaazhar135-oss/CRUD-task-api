let tasks=[
     { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Walk the dog", done: false },
  { id: 3, title: "Finish assignment", done: true }
];
function findById(id){
   return tasks.find(t=> t.id===id)
}
function findall(){
   return tasks;
}
function update(id,title,done){
 let task=tasks.find(t=> t.id===id);
 if(!task){
   return null;
 }
 if(title!==undefined){
   task.title=title;
 }
 if(done!==undefined){
   task.done=done;
 }
 return task
}

function del(id){
  const index=tasks.findIndex(t=> t.id===id);
  if(!index){
    return null;
  }
  const task=tasks.splice(index,1);
  return task;
}

function create(task){
 tasks.push(task);
 return task;
}

module.exports = {findById,findall,create,update,del};