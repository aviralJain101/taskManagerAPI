const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')

const userSchema = new mongoose.Schema({//to user middleware in mongoose
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw Error('Your password is too weak')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){//setting a custom validator
            if(value<0){
                throw Error('Age must be positive')
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true,
        }
    }],
    avatar: { //binary image data
        type: Buffer
    }
},{
    timestamps:true
})

//a virtual property is not an actual data stored it is a relationship between two objects
userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id', // name of field on local data
    foreignField:'owner' //name of the field on tasks
})

userSchema.methods.generateAuthToken = async function(){//accessed by instance of User model
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){//by toJSON we can change the return value when js object is converted to json i.e. of JSON.stringify()
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials = async(email,password)=>{ //statics can be accessed by User in any file
    const user = await User.findOne({email})
    if(!user){
        throw Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw Error('Unable to login')
    }
    return user
}

//hash the password before storing
userSchema.pre('save',async function(next){//to do a event just before saving
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()//to let know that we are done with this fuction
})

//delete tasks if user is deleted
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('Users',userSchema)

module.exports = User