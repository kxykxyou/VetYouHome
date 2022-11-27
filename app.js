require('dotenv').config()
const express = require('express')
const path = require('path')
const utils = require('./utils/utils')
// const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

app.use('/api/' + process.env.API_VERSION, require('./routes/users'))

app.use(utils.wrapAsync(utils.authUser))
app.use('/emt-data/', express.static(path.join(__dirname, 'emt-data')))

app.use('/api/' + process.env.API_VERSION, [
  require('./routes/records'),
  require('./routes/breeds'),
  require('./routes/vets'),
  require('./routes/pets'),
  require('./routes/inpatients'),
  require('./routes/cages'),
  require('./routes/clinic')
])

// Error handling
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send({ message: 'Internal Server Error' })
})

console.log('app listening on port 3000')

module.exports = app
