const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, ActiveSession } = require('../models')

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    const errorMessages = error.errors.map((e) => e.message)
    return res.status(400).send({ error: errorMessages })
  } else if (error.name == 'SequelizeDatabaseError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name == 'TypeError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name == 'Error') {
    return res.status(400).send({ error: error.message })
  } else next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.decodedToken.id)
  next()
}

const activeChecker = async (req, res, next) => {
  const user = req.user

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin',
    })
  }

  const session = await ActiveSession.findOne({
    where: {
      userId: user.id,
    },
  })

  if (!session) {
    return res.status(401).json({
      error: 'please log in',
    })
  }

  if (session.token !== req.get('authorization').substring(7)) {
    return res.status(401).json({
      error: 'token expired, please log in',
    })
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userFinder,
  activeChecker,
}
