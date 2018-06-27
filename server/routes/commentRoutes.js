const router = require('express').Router()
const { commentControllers } = require('../controllers')
const validator = require('../middleware')
const validateToken = validator.authenticateToken
const commentValidator = [ validator.commentValidator, validator.validate ]

router.post('/', validateToken, ...commentValidator, commentControllers.addComment)
router.get('/:postId', commentControllers.getAllComment)
router.put('/:id', validateToken, ...commentValidator, commentControllers.updateComment)
router.delete('/:id', validateToken, commentControllers.deleteComment)

module.exports = router