export function opreq() {
    return {
        send: function (todo) {
            return new Promise((resolve) => {
                fetch("/todo/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                }).then((response) => response.json()).then((json) => {
                    resolve(json);
                })
            });
        },
        load: function () {
            return new Promise((resolve) => {
                fetch("/todo").then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            });
        },
        completeTodo: function (todo) {
            return new Promise((resolve) => {
                fetch("/todo/complete", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                })
                .then((response) => response.json())
                .then((json) => {
                    resolve(json);
                })
            })
        },
        deleteTodo: function(id) {
            return new Promise((resolve) => {
                fetch("/todo/" + id, {
                    method: 'DELETE',
                    headers: {
                     "Content-Type": "application/json"
                    },
               })
               .then((response) => response.json())
               .then((json) => {
                    resolve(json);
                })
            })
        }
    }
}