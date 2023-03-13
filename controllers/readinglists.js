const router = require('express').Router()

const { Readinglistitem } = require('../models')

router.post('/', async (req, res) => {
  const item = await Readinglistitem.create({
    blogId: req.body.blog_id,
    userId: req.body.user_id,
  })
  res.json(item)
})

module.exports = router
