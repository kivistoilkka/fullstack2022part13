const router = require('express').Router()

const { Readinglistitem } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const item = await Readinglistitem.create({
    blogId: req.body.blog_id,
    userId: req.body.user_id,
  })
  res.json(item)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const item = await Readinglistitem.findByPk(req.params.id)
  if (item) {
    if (!(req.decodedToken.id === item.userId)) {
      res.status(401).json({
        error: 'only the owner of the reading list can update read status',
      })
    } else {
      item.read = req.body.read
      await item.save()
      res.json(item)
    }
  } else {
    res.status(404).end()
  }
})

module.exports = router
