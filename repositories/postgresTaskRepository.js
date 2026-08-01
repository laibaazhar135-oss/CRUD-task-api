const pool=require('../db/pgConnection');

async function getStats() {
    const totalResult=await pool.query('SELECT COUNT(*) AS count FROM tasks');
    const doneResult=await pool.query('SELECT COUNT(*) AS count FROM tasks WHERE done=true');

    const total=parseInt(totalResult.rows[0].count);
    const done=parseInt(doneResult.rows[0].count);
    return{
        total:total,
        done:done,
        open:total-done
    }
}

async function findById(id) {
    const result=await pool.query('SELECT * FROM tasks WHERE id=$1',[id]);
    if(result.rows.length===0) return null;
    const row=result.row[0];
    return{
        id:row.id,
        title:row.title,
        done:row.done,
        created_at:row.created_at,
        updated_at:row.updated_at
    }
}

async function findall(filters={}) {
    let query='SELECT * FROM tasks';
    let condition=[];
    let params=[];
    if(filters.done!==undefined){
        params.push(filters.done);
        condition.push(` done=$${params.length}`);
    }    
    if(filters.search){
        params.push(`%${filters.search}%`);
        condition.push(` title ILIKE ${params.length}`);
    }
   if(condition.length>0){
    query+=' WHERE '+condition.join(' AND ');
   }
   query+=' ORDER BY title';
   const result=await pool.query(query,params);
   return result.rows.map(r=>({
    id:r.id,
    title:r.title,
    done:r.done,
    created_at:r.created_at,
    updated_at:r.updated_at
   }))
}

async function create(title,done) {
    const result=await pool.query('INSERT INTO tasks (title,done) VALUES ($1,$2) RETURNING *',[title,done]);
  const row=result.rows[0];
  return{
    id:row.id,
    title:row.title,
    done:row.done,
    created_at:row.created_at,
    updated_at:row.updated_at
  }
}

async function update(id,title,done) {
    const existing=pool.query('SELECT * FROM tasks WHERE id=$1',[id]);
    if(existing.rows.length===0) return null;
    
    const row=existing.rows[0];
    const newTitle=title!==undefined?title:row.title;
    const newDone=done!==undefined?done:row.done;

    const result=await pool.query('UPDATE tasks SET title=$1,done=$2,updated_at= NOW() WHERE id=$3',(newTitle,newDone,id));
    
    const r=result.rows[0];
    return{
        id:r.id,
        title:r.title,
        done:r.done,
        created_at:r.created_at,
        updated_at:r.updated_at
    };
}

async function del(id) {
    const existing= await pool.query('SELECT * FROM tasks WHERE id=$1',[id]);
    if(existing.rows.length===0) return null;
    const row=existing.rows[0];
    pool.query('DELETE FROM tasks WHERE id=$1',[id]);
    return{
        id:row.id,
        title:row.title,
        done:row.done,
        created_at:row.created_at,
        updated_at:row.updated_at
    }
}
module.exports={getStats,findall,findById,create,del,update};