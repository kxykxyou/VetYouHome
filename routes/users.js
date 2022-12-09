const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { wrapAsync, authAdmin } = require('../utils/utils')

/* GET users listing. */
router.post('/users/signup', wrapAsync(authAdmin), wrapAsync(usersController.signup))

router.post('/users/signin', wrapAsync(usersController.signin))

module.exports = router
