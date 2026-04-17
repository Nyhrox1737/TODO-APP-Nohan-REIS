const urlAPI = "http://localhost:3000/"

const todoList = document.getElementById("todoList")
const todoInput = document.getElementById("todoInput")
const addBtn = document.getElementById("addBtn")
const errorMsg = document.getElementById("errorMsg")

getAllTodos()

addBtn.addEventListener("click", addTodo)

todoInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTodo()
})

function getAllTodos() {
    fetch(urlAPI + "todos")
        .then(response => response.json())
        .then(data => displayTodos(data))
        .catch(error => {
            errorMsg.textContent = "Erreur lors du chargement des todos"
            console.error("Error fetching data : ", error)
        })
}

function displayTodos(todos) {
    todoList.replaceChildren()
    errorMsg.textContent = ""
    todos.forEach(todo => {
        const li = document.createElement("li")
        li.className = "todo-item" + (todo.done ? " done" : "")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = todo.done
        checkbox.addEventListener("change", function () {
            toggleTodo(todo.id, !todo.done)
        })

        const span = document.createElement("span")
        span.textContent = todo.title

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Supprimer"
        deleteBtn.addEventListener("click", function () {
            deleteTodo(todo.id)
        })

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(deleteBtn)
        todoList.appendChild(li)
    })
}

function addTodo() {
    const title = todoInput.value.trim()
    if (!title) {
        errorMsg.textContent = "Veuillez entrer un titre"
        return
    }
    errorMsg.textContent = ""

    fetch(urlAPI + "todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) })
            }
            return response.json()
        })
        .then(() => {
            todoInput.value = ""
            getAllTodos()
        })
        .catch(error => {
            errorMsg.textContent = error.message
            console.error("Error adding todo : ", error)
        })
}

function toggleTodo(id, done) {
    fetch(urlAPI + "todos/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: done })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) })
            }
            return response.json()
        })
        .then(() => getAllTodos())
        .catch(error => {
            errorMsg.textContent = "Erreur lors de la modification"
            console.error("Error updating todo : ", error)
        })
}

function deleteTodo(id) {
    fetch(urlAPI + "todos/" + id, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message) })
            }
            return response.json()
        })
        .then(() => getAllTodos())
        .catch(error => {
            errorMsg.textContent = "Erreur lors de la suppression"
            console.error("Error deleting todo : ", error)
        })
}
