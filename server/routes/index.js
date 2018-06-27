const router = require('express').Router();
const staticRoutes = require('./staticRoutes.js');
const postRoutes = require('./postRoutes.js')
const commentRoutes = require('./commentRoutes.js')

router.use('/',staticRoutes)
router.use('/posts',postRoutes)
router.use('/comments',commentRoutes)


module.exports = router