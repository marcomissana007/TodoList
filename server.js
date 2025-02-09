const fs = require('fs');
const mysql = require('mysql2');

// Connessione DB
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

// SQL
const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject();     
             }   
             resolve(result);         
       });
    })
}

const createTable = () => {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS todo
       ( id VARCHAR(255) PRIMARY KEY, 
          name VARCHAR(255) NOT NULL, 
          completed BOOLEAN ) 
       `);      
}

createTable(); // Crea tabella se non esiste

const insert = (todo) => {
    const template = `
    INSERT INTO todo (id, name, completed) VALUES ('%ID', '$NAME', '$COMPLETED')
       `;
    let sql = template.replace("$NAME", todo.name)
                .replace("%ID", todo.id)
                .replace("$COMPLETED", todo.completed ? 1 : 0);
    return executeQuery(sql); 
}

const select = () => {
    const sql = `
    SELECT id, name, completed FROM todo 
       `;
    return executeQuery(sql); 
}

const update = (todo) => {
    let sql = `
    UPDATE todo
    SET completed=$COMPLETED
    WHERE id=$ID
       `;
    sql = sql.replace("$ID", todo.id);
    sql = sql.replace("$COMPLETED", todo.completed ? 1 : 0);
    return executeQuery(sql); 
}

const deleteTodo = (id) => {
    let sql = `
    DELETE FROM todo
    WHERE id=%ID
       `;
    sql = sql.replace("%ID", id);
    return executeQuery(sql); 
 }

const express = require("express");
const app = express();
let http = require("http");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));

let todos = [];

app.post("/todo/add", (req, res) => {
   const todo = req.body.todo;
   todo.id = "" + new Date().getTime();
   insert(todo);
   res.json({result: "Ok"});
});

app.get("/todo", async (req, res) => {
    const todos = await select();
    res.json({todos: todos});
});

app.put("/todo/complete", async (req, res) => {
    const todo = req.body.todo;
    try {
        await update(todo);
    } catch (e) {
       console.log(e);
    } 
    res.json({result: "Ok"});
});

app.delete("/todo/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.json({result: "Ok"});   
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});