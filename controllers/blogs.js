const { Op } = require('sequelize')
const router = require('express').Router()

const { Blog, User } = require('../models')
const {
  tokenExtractor,
  userFinder,
  activeChecker,
} = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username', 'name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post(
  '/',
  tokenExtractor,
  userFinder,
  activeChecker,
  async (req, res) => {
    const blog = await Blog.create({ ...req.body, userId: req.user.id })
    res.json(blog)
  }
)

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete(
  '/:id',
  blogFinder,
  tokenExtractor,
  userFinder,
  activeChecker,
  async (req, res) => {
    if (req.blog) {
      if (!(req.decodedToken.id === req.blog.userId)) {
        res
          .status(401)
          .json({ error: 'only the user who added the blog can delete it' })
      } else {
        await req.blog.destroy()
      }
    }
    res.status(204).end()
  }
)

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
