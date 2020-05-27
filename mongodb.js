//CRUD create read update delete operations
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
const {MongoClient,ObjectID} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'//name of database

// const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionUrl,{useNewUrlParser: true, useUnifiedTopology: true},(error,client)=>{
    if(error){
        return console.log('Cant connect to database')
    }
    const db = client.db(databaseName)//create or use a database with name databaseName
    
    //creating data
    // db.collection('users').insertOne({
    //     name:'AVJ',
    //     age:21
    // }, (error, result)=>{
    //     if(error){
    //        return console.log('An error occured while inserting')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'AVJFuture',
    //         age:22
    //     },
    //     {
    //         name: 'AVJPast',
    //         age:20
    //     }
    // ],(error, result)=>{
    //     if(error){
    //         return console.log('Error occured')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Get into IIT',
    //         completed: true
    //     },
    //     {
    //         description: 'Get an intern',
    //         completed: false
    //     },
    //     {
    //         description: 'Be happy',
    //         completed: true
    //     }
    // ],(error, result)=>{
    //     if(error){
    //         return console.log('an error occured')
    //     }
    //     console.log(result.ops)
    // })

    //reading data
    db.collection('users').findOne({_id:ObjectID("5ec422bee396fc7c49ef8ec4")},(error,user)=>{
        if(error){
            return console.log('unable to fetch user')
        }
        console.log(user)
    })

    db.collection('tasks').find({completed: true}).toArray((error,tasks)=>{
        if(error){
            return console.log('Unable to fetch tasks')
        }
        console.log(tasks)
    })

    db.collection('tasks').find({completed: true}).count((error,count)=>{
        if(error){
            return console.log('Unable to fetch tasks')
        }
        console.log(count)
    })

    // db.collection('tasks').findOne({completed:true},(error,task)=>{
    //     console.log(task)
    // })

    // db.collection('tasks').updateOne({
    //     _id: ObjectID("5ec42653f1d0647df2ed2242")
    // },{
    //     $set:{
    //         completed: false
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    //updating data
    // db.collection('users').updateOne({
    //     name:'AVJFuture'
    // },{
    //     $inc:{
    //        age:1 
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').updateMany({
        completed: false
    },{
        $set:{
            completed:true
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

    //deleting a doc
    db.collection('users').deleteMany({
        name:'AVJPast'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})