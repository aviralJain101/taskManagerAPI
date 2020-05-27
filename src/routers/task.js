const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async(req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

//Get/tasks?completed=trueorfalse //provideing queries also where true is string not bool
// GET tasks?limit=10&skip=0or20something to skip like pages in google results //this allows us to load 10 tasks at a time
// GET tasks?sortBy=completedAt:desc or asc
router.get('/tasks', auth, async(req,res)=>{
    const match={}
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1:1
    }
    if(req.query.completed){
        match.completed=req.query.completed=='true'
    }
    try{
        //const tasks = await Task.find({owner: req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(error){
        res.status(500).send(tasks)
    }
})

router.get('/tasks/:id', auth, async(req,res)=>{
    try{
        //const task = await Task.findById(req.params.id)
        const _id=req.params.id
        const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send('Please provide a valid id')
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async(req,res)=>{
    const allowedUpdates = ['description','completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Invalid update')
    }
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const task = await Task.findById(req.params.id)
        const _id=req.params.id
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task){
            res.status(404).send('Not found')
        }

        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})


module.exports = router