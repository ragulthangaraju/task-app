const mongoose  = require('mongoose')
const validator = require('validator')
const bcryptjs  = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    age:{
        type: Number
    },
    password:{
        type: String,
        minlength: 7,
        required:true,
        trim:true
    },
    avatar:{
        type: Buffer
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }],
    email:{
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'userId'
})
 
userSchema.methods.generatingToken = async function () {
    const user = this  
    const token = jwt.sign({ _id: user._id.toString() }, 'ragulragi', { expiresIn: '1 weeks' })

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.toJSON = function(){
    const userData = this
    const userObject = userData.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const isUser = await User.findOne({ email })
    
    if (!isUser) {
        throw new Error('Unable to login')
    }

    const isPassword = await bcryptjs.compare(password, isUser.password)

    if (!isPassword) {
        throw new Error('Unable to login')
    }

    return isUser
}

// to hash the text password
userSchema.pre('save', async function(next) {
    const user = this 

    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 6)        
    }
    next()
})

const User = mongoose.model('users', userSchema)

module.exports = User
