const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const User = require('./models/user')
const Exercise = require('./models/exercise')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.json())

// Connect to the MongoDB 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

// Set POST route at /api/users
app.post('/api/users', async (req, res) => {
  try{
    const username = req.body.username

    const user = await User.create({username: username})

    const user_id = user._id

    res.json({
      username: username,
      _id: user_id
    })
  }
  catch(error){
    console.error(error)
    res.status(500).json({error: 'Failed to create user'})
  }
})

// Set GET route for a get-request to show an array of all users
app.get('/api/users', async (req, res) =>{
  try{
    const users = await User.find({})

    console.log('Uers found: ', users)

    res.json(users)
  }

  catch(error){
    console.error(error)
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
