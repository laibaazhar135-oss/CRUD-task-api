const db = require('../db/connection');

let tasks=[
     { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Walk the dog", done: false },
  { id: 3, title: "Finish assignment", done: true }
];

function  findById(id){
  const row=db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
  if(!row) return undefined;
  return {
       id:row.id,
       title:row.title,
       done:row.done===1
  }
}

function findall(){
  const row= db.prepare('SELECT * FROM tasks').all();
  return row.map(r=>({
        id:r.id,
        title:r.title,
        done:r.done===1
  }));
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
    return -1;
  }
  const task=tasks.splice(index,1);
  return task;
}

function create(title,done){
    const insert= db.prepare('INSERT INTO tasks (title,done) VALUES (?,?)');
    const result = insert.run(title,done?1:0);
    return {
      id:result.lastInsertRowid,
      title:title,
      done:done
    }
}

module.exports = {findById,findall,create,update,del};