const { DatabaseSync}=require('node:sqlite');
const path = require('path');

const dbpath=path.join('__dirname','..','db','tasks.db');

const db= new DatabaseSync(dbpath);

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT
    title TEXT NOT NULL
    done INTEGER NOT NULL DEFAULT 0
    )
    `);

const row=db.prepare('SELECT COUNT(*) AS count FROM tasks').get();

if(row.count===0){
    const insert=db.prepare('INSERT INTO TASKS (title,done) VALUES (?,?)');
    insert.run();
    insert.run();
    insert.run();
}
module.exports=db;