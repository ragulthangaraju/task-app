const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        validate(value) {
            if (!value) {
                throw new Error('please enter some description')
            }
        }
    },
    completed:{
        type: Boolean
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
},{
    timestamps: true
})

const tasks = mongoose.model('tasks', taskSchema)

module.exports = tasks
