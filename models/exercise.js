const mongoose = require('mongoose')

const {Schema} = mongoose

const exerciseSchema = new Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date
})


const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise