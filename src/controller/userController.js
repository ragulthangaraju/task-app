const express = require('express')
const userModel = require('../model/userModel')
const taskModel = require('../model/taskModel')
const emailSend = require('../email/accountMail')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

const upload = multer({
    // dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return callback(new Error('Please upload an image'))
        }

        callback(undefined, true)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send(req.user)

},(error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

router.delete('/users/me/avatar', auth, (req, res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

router.post('/users', upload.single('upload'), async (req, res) => {
    const user = new userModel(req.body)

    try {
        await user.save()
        const token = await user.generatingToken()
        emailSend.welcomeEmail(user.email, user.name)

        res.status(200).send({ user, token})

    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await userModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generatingToken()
        
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    const filteredUserData = await req.user.filteredUserData()
    res.send(filteredUserData)
})

router.get('/users/:id/:name', (req, res) => {
    const _id = req.params.id
    const name = req.params.name

    // userModel.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }

    //     res.status(200).send(user)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

    userModel.find({name:name}).then((user) => {
        if (!user) {
            return res.status(404).send()
        }

        res.status(200).send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdated = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdated.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error:'Not valid'})
    }

    try {

        // const user = await userModel.findByIdAndUpdate(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/logout', auth,async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/logoutAll', auth,async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    
    try {
        await req.user.remove()
        await taskModel.deleteMany({ userId: req.user._id })

        emailSend.cancellationEmail(req.user.email, req.user.name)

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)   
    }
})


module.exports = router
