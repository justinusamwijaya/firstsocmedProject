const router = require('express').Router();
const { postControllers } = require('../controllers')
const validator = require('../middleware')
const validateToken = validator.authenticateToken
const postValidator = [ validator.postValidator, validator.validate ]

router.post('/', validateToken, ...postValidator, postControllers.addPost)
router.get('/', postControllers.getAllPost)
router.get('/getfromid/:id', postControllers.getAllPost)
router.get('/:id', postControllers.getOnePost)
router.put('/addlike/:id',validateToken, postControllers.addLike)
router.put('/removelike/:id',validateToken,postControllers.removeLike)
router.put('/:id', validateToken, ...postValidator, postControllers.updatePost)
router.delete('/:id', validateToken, postControllers.deletePost)

module.exports = router