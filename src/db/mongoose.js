const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false //to remove deoprecation warning while using find and modify
})


// const me = new User({
//     name:'AVJ',
//     email:'avj@gmail.com',
//     password: 'avjkota10',
//     age:21
// })
// me.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })



// const newTask = new tasks({
//     description:'Start nodejs course',
// })
// newTask.save().then(()=>{
//     console.log(newTask)
// }).catch((error)=>{
//     console.log(error)
// })