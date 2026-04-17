const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '../data.json')

function readData() {
    const raw = fs.readFileSync(dataPath, 'utf-8')
    return JSON.parse(raw)
}

function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

const getAllTodos = (req, res) => {
    const data = readData()
    res.status(200).json(data.todos)
}

const getTodoById = (req, res) => {
    const id = parseInt(req.params.id)
    const data = readData()
    const todo = data.todos.find(todo => todo.id === id)
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' })
    } else {
        res.status(200).json(todo)
    }
}

const createTodo = (req, res) => {
    const { title } = req.body
    if (!title) {
        return res.status(400).json({ message: 'Title is required' })
    }
    const data = readData()
    const newId = data.todos.length > 0 ? data.todos[data.todos.length - 1].id + 1 : 1
    const newTodo = { id: newId, title: title, done: false }
    data.todos.push(newTodo)
    writeData(data)
    res.status(201).json(newTodo)
}

const updateTodo = (req, res) => {
    const id = parseInt(req.params.id)
    const { title, done } = req.body
    const data = readData()
    const todo = data.todos.find(todo => todo.id === id)
    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' })
    }
    if (title !== undefined) todo.title = title
    if (done !== undefined) todo.done = done
    writeData(data)
    res.status(200).json(todo)
}

const deleteTodo = (req, res) => {
    const id = parseInt(req.params.id)
    const data = readData()
    const index = data.todos.findIndex(todo => todo.id === id)
    if (index === -1) {
        return res.status(404).json({ message: 'Todo not found' })
    }
    data.todos.splice(index, 1)
    writeData(data)
    res.status(200).json({ message: 'Todo deleted' })
}

module.exports = { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo }
