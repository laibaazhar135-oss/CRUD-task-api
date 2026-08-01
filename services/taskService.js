let taskRepository= require('../repositories/postgresTaskRepository');

async function getStats(){
     return await taskRepository.getStats();
}

async function getTaskById(id){
     return await taskRepository.findById(id);
}

async function findalltasks(filters){

  if(filters.done!==undefined){
     if(filters.done!=='true'&&filters.done!=='false'){
          return {error:"done must me true or false"};
     }
  }
  const doneFilter= filters.done!==undefined?filters.done=='true':undefined;

  const result=await taskRepository.findall({
     done:doneFilter,
     search:filters.search
  })

  return {tasks: result};
}

async function createTask(title,done){
     if(typeof title!=='string'||title.trim().length===0){
          return {error:"Title is required and must me a non-empty string"}
     }
     if(done!==undefined&&typeof done!=='boolean'){
          return {error:"done must me boolean"}
     }
     
     const finaldone=done===undefined ? false : done;
     
     const created=await taskRepository.create(title.trim(),finaldone);
     return {task:created}
}

async function updateTask(id,title,done){
 if(title!==undefined&&(typeof title!=='string'|| title.trim().length===0)){
     return {error:"title is required and must be a non empty string"};
 }
 if(done!==undefined&&typeof done!=='boolean'){
     return {error:"done must be in boolean"};
 }
 const updatedTask=await taskRepository.update(id,title,done);
 if(!updatedTask){
     return {error:`task ${id} not found`,notFound:true}
 }
 return {task:updatedTask};
}

async function delTask(id){
   const result=await taskRepository.del(id);
   if(!result){
     return {error:`task ${id} not found`};
   }
   return {task:result};
}

module.exports={getTaskById,findalltasks,createTask,updateTask,delTask,getStats};