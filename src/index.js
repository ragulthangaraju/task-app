const express = require('express')
require('./db/mongoose')
const userController = require('./controller/userController')
const taskRouter = require('./controller/taskContoller')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userController)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


