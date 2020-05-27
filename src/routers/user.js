const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()

//login user
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token:token})
    }catch(error){
        res.status(400).send()
    }
})

router.post('/users',async(req,res)=>{
    const user = new User(req.body)

    try{
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user,token});
    }catch(error){
        res.status(400).send(error)
    }

    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>token.token !== req.token)
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth , async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send('logged out of all devices')
    }catch(error){
        res.status(500).send(error)
    }
})

//providing a avatar
const upload = multer({
    //dest:'avatars',
    limits: {
        fileSize:1000000,
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ //where \.(doc|docx)$ is a regular expression
            return callback(Error('upload a image'))
        }
        callback(undefined,true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer() //.png() converts to png
    req.user.avatar = buffer
    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{ //this function handle errors provided by default middlewares like upload.single
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar', auth, async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send(req.user)
    }catch(error){
        res.send(error.message)
    }
})

//get avatar by id for clients using the api
router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')//sending header of image type
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }

})


router.get('/users/me', auth ,async(req,res)=>{
   res.send(req.user)

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
})

//getting user by id
// router.get('/users/:id', auth ,async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     }catch(error){
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((error)=>{
//     //     res.status(500).send()
//     // })
// })

//updating a users
router.patch('/users/me', auth, async(req,res)=>{
    const allowedUpdates = ['name','email','password','age']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Invalid update')
    }

    try{
        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        //     runValidators:true,
        //     new:true
        // })
        //findByIdAndUpdate bypass mongoose and doesnt run middleware
        const user = req.user
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
        if(!user){
            return res.status(404).send('User not found')
        }
        res.send(user)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)

    }catch(error){
        res.status(500).send(error)
    }
})


module.exports = router