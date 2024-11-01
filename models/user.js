const mongoose = require('mongoose')

// Destructure Schema
const {Schema} = mongoose

const userSchema = new Schema({
    username: String
})

const User = mongoose.model('User', userSchema)

module.exports = User