require('dotenv').config()
const PORT = process.env.PORT || '3000'
const express = require('express')
const path = require('path')
const utils = require('./utils/utils')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))

app.use('/api/' + process.env.API_VERSION, require('./routes/users'))

app.use(utils.wrapAsync(utils.authUser))

app.use('/api/' + process.env.API_VERSION, [
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
Error handling
*/
app.use(function (error, req, res, next) {
  // TODO: 加上發生時間
  console.log(error)
  return res.status(500).json({ error: 'Internal Server Error' })
})

/*
Not found page
*/
// FIXME: 如何在有驗證的情況下導到404 page?
app.use(function (req, res, next) {
  return res.status(404).sendFile('./views/404.html')
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log('app listening on port 3000')
})

module.exports = app
