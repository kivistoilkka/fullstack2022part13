const router = require('express').Router()

const { ActiveSession } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const oldSession = await ActiveSession.findOne({
    where: {
      userId: req.decodedToken.id,
    },
  })
  if (oldSession) {
    oldSession.destroy()
  }
  res.status(204).end()
})

module.exports = router
