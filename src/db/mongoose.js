const mongoose = require('mongoose')

// mongodb://127.0.0.1:27017/task-manager-api
// mongodb+srv://taskapp:3n3yffb39627@cluster0-wk7gk.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://taskapp:3n3yffb39627@cluster0-wk7gk.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// const User = mongoose.model('User', {
//     name:{
//         type: String
//     },
//     age:{
//         type: Number
//     }
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })