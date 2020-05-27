const express = require('express')
require('./db/mongoose')
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')


const app = express()
const port = process.env.PORT

// app.use((req,res,next) => {//middleware for express routes new request->middleware->run route handler
//     res.status(503).send('Under Management')
// })


app.use(express.json())//parse the incoming json data
app.use(userRoute)//to use user route
app.use(taskRoute)//use task route


app.listen(port,()=>{
    console.log('server is up on port',port)
})  

//using populate
// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async ()=>{
//     const task = await Task.findById('5ecc34deb3007545754941d9')
//     //populate allows us to populate data from a relationship
//     await task.populate('owner').execPopulate()
//     //after populating task.owner has profile of user
//     console.log(task.owner)
//     const user = await User.findById('5ecc34a4b3007545754941d7')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
