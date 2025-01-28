import { opreq } from "./opreq.js";

const requests = opreq();
const todoInput = document.getElementById("todoInput");
const insertButton = document.getElementById("insertButton");
const todoList = document.getElementById("todoList");

let todos = [];

const render = () => {
    todoList.innerHTML = "";
    todos.forEach((element) => {
        todoList.innerHTML += `
            <li>
        ` + element.name + `<button id="delete_` + element.id + `">Delete</button>`  
        + (element.completed ? `<input id="check_` + element.id + `" type="checkbox" checked>` : `<input id="check_` + element.id + `" type="checkbox">`)
        + `</li>`;
    });

    const buttons = document.querySelectorAll('button[id^="delete_"]');
    buttons.forEach((element) => {
        element.onclick = () => {
            requests.deleteTodo(element.id.split("_")[1]).then(() => {
                requests.load().then((json) => {
                    todos = json.todos;
                    render();
                });
            });
        }
    });

    const checkButtons = document.querySelectorAll('input[id^="check_"');
    checkButtons.forEach((element) => {
        element.onclick = () => {
            const todo = todos.find(t => t.id === element.id.split("_")[1]);
            todo.completed = element.checked;
            requests.completeTodo({
                todo: todo
            })
            .then(() => requests.load())
            .then((json) => {
                todos = json.todos;
            });
        }
    });
}

insertButton.onclick = () => {
    if (todoInput.value != "") {
        const todo = {
            name: todoInput.value,
            completed: false
        }

        requests.send({
            todo: todo
        })
        .then(() => requests.load())
        .then((json) => {
            todos = json.todos;
            todoInput.value = "";
            render(); 
        });
    }
}

requests.load().then((json) => {
    todos = json.todos;
    render();
});

setInterval(() => {
    requests.load().then((json) => {
       todos = json.todos;
       todoInput.value = "";
       render();
    });
}, 30000);