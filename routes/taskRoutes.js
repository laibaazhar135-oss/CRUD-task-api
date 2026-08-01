const express=require('express');
const router= express.Router();
const taskService=require('../services/taskService');
const asyncHandler=require('../utils/asyncHandler');

router.get('/stats',asyncHandler(async(req,res)=>{
    const result=await taskService.getStats();
    res.json(result);
}))

router.get('/tasks/:id',asyncHandler(async(req,res)=>{
    const id=parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({error:`id must be a number`})
    }
    const task=await taskService.getTaskById(id);

    if(!task){
        return res.status(404).json({error:`task ${id} not found`});
    }
    res.json(task);
})); 

router.get('/tasks',asyncHandler(async(req,res)=>{

 const result= await taskService.findalltasks(req.query);
 if(result.error){
    return res.status(400).json({error:result.error})
 }
 res.json(result.tasks)
}));

router.post('/tasks',asyncHandler(async(req,res)=>{
 const {title,done}=req.body;
 const result=await taskService.createTask(title,done);
 if(result.error){
   return res.status(400).json({error:result.error});
 }
 res.status(201).json(result.task);
}));

router.put('/tasks/:id',asyncHandler(async(req,res)=>{
const id=parseInt(req.params.id);
 if(isNaN(id)){
        return res.status(400).json({error:`id must be a number`})
    }
const {title,done}=req.body;
const final=await taskService.updateTask(id,title,done);
if(final.error){
    if(final.notFound){
        return res.status(404).json({error:final.error})
    }
    return res.status(400).json({error:final.error});
}
res.status(200).json(final.task);
}))

router.delete('/tasks/:id',asyncHandler(async(req,res)=>{
 const id=parseInt(req.params.id);
  if(isNaN(id)){
        return res.status(400).json({error:`id must be a number`})
    }
 const result=await taskService.delTask(id);
 if(result.error){
    return res.status(404).json({error:result.error});
 }
 res.status(204).send();
}));

module.exports = router;
