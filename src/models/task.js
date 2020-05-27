const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true,

    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users',
    }
},{
    timestamps:true,
})

const Task = mongoose.model('Tasks',taskSchema)

module.exports = Task