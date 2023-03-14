const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, ActiveSession } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    timeIssued: Date.now(),
  }

  const token = jwt.sign(userForToken, SECRET)

  const oldSession = await ActiveSession.findOne({
    where: {
      userId: user.id,
    },
  })
  if (oldSession) {
    oldSession.destroy()
  }

  await ActiveSession.create({
    userId: user.id,
    token,
  })

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })
})

module.exports = router
