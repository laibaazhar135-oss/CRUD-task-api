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
  const existing=db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
  if(!existing){
    return null;
  }
  const newTitle=title!==undefined?title:existing.title;
  const newDone=done!==undefined?(done?1:0):existing.done;
  
  db.prepare('UPDATE tasks SET title=?,done=? WHERE id=?').run(newTitle,newDone,id);
  return {
    id:id,
    title:newTitle,
    done:newDone==1
  }
}

function del(id){
   const existing=db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
   if(!existing){
    return null;
   }
   db.prepare('DELETE FROM tasks WHERE id=?').run(id);
   return {
    id:id,
    title:existing.title,
    done:existing.done === 1
   }
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