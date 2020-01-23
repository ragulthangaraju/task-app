const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodeToken = jwt.verify(token, 'ragulragi')
        const userDetails = await userModel.findOne({ _id:decodeToken._id, 'tokens.token': token })
        
        if (!userDetails) {
            throw new Error()
        }
        req.token = token
        req.user = userDetails
        next()
        
    } catch (e) {
        res.status(401).send({error: 'please authenticate'})
    }
}

module.exports = auth 
