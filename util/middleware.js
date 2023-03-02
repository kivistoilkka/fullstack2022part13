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

module.exports = { unknownEndpoint, errorHandler }
