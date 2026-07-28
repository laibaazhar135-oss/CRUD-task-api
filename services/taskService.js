let taskRepository= require('../repositories/taskRepository');

function getTaskById(id){
     return taskRepository.findById(id);
}

function findalltasks(filters){
  let result=taskRepository.findall();

  if(filters.done!==undefined){
     if(filters.done!=='true'&&filters.done!=='false'){
          return {error:"done must me true or false"};
     }
     const doneFilter= filters.done==='true';
      result= result.filter(t=> t.done===doneFilter);
  }
  if(filters.search){
     const term=filters.search.toLowerCase();
     result= result.filter(t=> t.title.toLowerCase().includes(term));
  }
  return {tasks: result};
}

function createTask(title,done){
     if(typeof title!=='string'||title.trim().length===0){
          return {error:"Title is required and must me a non-empty string"}
     }
     if(done!==undefined&&typeof done!=='boolean'){
          return {error:"done must me boolean"}
     }
     
     const finaldone=done===undefined ? false : done;
     
     const created=taskRepository.create(title.trim(),finaldone);
     return {task:created}
}

function updateTask(id,title,done){
 if(typeof title!=='string'|| title.trim().length===0){
     return {error:"title is required and must be a non empty string"};
 }
 if(done!==undefined&&typeof done!=='boolean'){
     return {error:"done must be in boolean"};
 }
 const updatedTask=taskRepository.update(id,title,done);
 if(!updatedTask){
     return {error:`task ${id} not found`,notFound:true}
 }
 return {task:updatedTask};
}

function delTask(id){
   const result=taskRepository.del(id);
   if(!result){
     return {error:`task ${id} not found`};
   }
   return {task:result};
}

module.exports={getTaskById,findalltasks,createTask,updateTask,delTask};