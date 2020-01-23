const express = require('express')
const tasks = require('../model/taskModel')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, (req, res) => {
    req.body.userId = req.user._id
    const task = tasks(req.body)

    task.save().then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get('/tasks/:id', auth, (req, res) => {
    const _id = req.params.id

    tasks.findOne({ _id, userId: req.user.id }).then((task) => {
        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })

})

router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const options = {}
        const sort = {}

        match.userId = req.user._id
        if (req.query.completed) {
            match.completed = req.query.completed
        }
        options.limit = parseInt(req.query.limit)
        options.skip = parseInt(req.query.skip)
        
        const task = await tasks.find(match).setOptions(options)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        console.log(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdated = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdated.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error : 'Invalid Request!'})
    }

    try {
        const task = await tasks.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await tasks.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        
        if (!task) {
            return res.status(404).send({ error: 'No task found' })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router