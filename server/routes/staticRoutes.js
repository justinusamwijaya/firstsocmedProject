const router = require('express').Router()
const { staticControllers } = require('../controllers')
const validator = require('../middleware')
const signupValidate = [ validator.signupValidator, validator.validate ]
const loginValidate = [ validator.loginValidator, validator.validate ]

router.post('/signup', ...signupValidate, staticControllers.signup)
router.post('/login', ...loginValidate, staticControllers.login)

module.exports = router