const mongodb = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// // To run mongodb
// // Users/concert/mongodb/bin/mongod.exe --dbpath=/Users/concert/mongodb-data

mongodb.MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {

    if(error){
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    // insert one into mongodb
    // db.collection('tasks').insertOne({
    //     tasks:'football match in the evening',
    //     desc:'playing for my team'
    // })

    // insert many into mongodb
    // db.collection('tasks').insertMany([
    //     {
    //         tasks:'football match in the evening',
    //         desc:'playing for my team'
    //     },
    //     {
    //         tasks:'football match in the evening',
    //         desc:'playing for my team'
    //     }
    // ])

    // find by using _id
    // db.collection('tasks').find({ _id: new mongodb.ObjectId("5e1818987fbf662254dcef07")}, (error, result) => {
    //     console.log(result)
    // })

    // insert many into mongo db
    // db.collection('users').insertMany([
    //     {
    //         name:'thanga',
    //         age:60
    //     },{
    //         name:'valar',
    //         age:56
    //     }
    // ])

    // find one in mongodb,
    // by finding using _id you must use findOne to get the value
    // db.collection('users').findOne({_id: new mongodb.ObjectID("5e16fd5b7ff609049c9bcabd")}, (error, data) => {
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }

    //     console.log(data)
    // })

    // db.collection('users').find({ name:'valar' }).toArray((error, users1) => {
    //     console.log(users1)
    // })

// db.collection('users').updateOne({ _id: new mongodb.ObjectID("5e16fd5b7ff609049c9bcabd")}, {
//     $inc: {
//         age: 1
//     }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })


// db.collection('users').update({ name }, {
//     $inc: {
//         age: 1
//     }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

})

// call back function
// const doWork = (callback) => {
//     setTimeout(() => {
//         callback(undefined, {
//             name:'Ragul',
//             age: 24
//         })
//     }, 2000)
// }

// doWork((error, result) => {

//     if(error){
//        return console.log(error)
//     }
//     console.log(result.name)
// })

// Promises
// const doWorkPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('you have been passed')
//         // reject('rejected')
//     }, 2000)
//     // resolve('you have been passed')
// })

// doWorkPromise.then((resolve) => {
//     console.log('Success', resolve)
// }).catch((reject) => {
//     console.log('Error!', reject)
// })