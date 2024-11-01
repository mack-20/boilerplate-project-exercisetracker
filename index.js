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


// Set POST route at /api/users
app.post('/api/users', (req, res) => {
  const user = new User({
    username: req.body.username
  })
  
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
