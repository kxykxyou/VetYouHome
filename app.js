require('dotenv').config()
const PORT = process.env.PORT || '3000'
const express = require('express')
const path = require('path')
const utils = require('./utils/utils')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

/*
內部註冊以及登入API
*/
app.use('/api/' + process.env.API_VERSION, require('./routes/users'))

/*
All api need authorization to access
*/
app.use('/api/' + process.env.API_VERSION, utils.authUser, [
  require('./routes/records'),
  require('./routes/breeds'),
  require('./routes/vets'),
  require('./routes/pets'),
  require('./routes/cages'),
  require('./routes/registers'),
  require('./routes/clinic'),
  require('./routes/inpatients'),
  require('./routes/emt')
])

/*
Not found page: 若有登入但亂輸入網址會得到404 page
*/
app.use('*', function (req, res, next) {
  return res.status(404).sendFile(path.join(__dirname, '/views/404.html'))
})

/*
Error handling
*/
app.use(function (error, req, res, next) {
  // TODO: 加上發生時間
  console.log(error)
  return res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log('app listening on port 3000')
})

module.exports = app
