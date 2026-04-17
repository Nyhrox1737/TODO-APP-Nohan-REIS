const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
app.use(cors({ origin: '*' }))

app.use(express.json())

const todoRouter = require('./router/todos')
app.use(todoRouter)

app.listen(port, () => console.log('Server listening on port 3000!'))
