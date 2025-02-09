const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
const connection = mysql.createConnection(conf);
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
   todos.push(todo);
   res.json({result: "Ok"});
});

app.get("/todo", (req, res) => {
   res.json({todos: todos});
});

app.put("/todo/complete", (req, res) => {
    const todo = req.body.todo;
    try {
        todos = todos.map((element) => {
            if (element.id === todo.id) {
                element.completed = todo.completed;
            }
            return element;
        })
    } catch (e) {
       console.log(e);
    } 
    res.json({result: "Ok"});
});

app.delete("/todo/:id", (req, res) => {
    todos = todos.filter((element) => element.id !== req.params.id);
    res.json({result: "Ok"});   
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});
