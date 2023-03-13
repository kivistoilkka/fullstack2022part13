const Blog = require('./blog')
const User = require('./user')
const Readinglistitem = require('./readinglistitem')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglistitem, as: 'savedBlogs' })
Blog.belongsToMany(User, { through: Readinglistitem, as: 'usersSaved' })

module.exports = {
  Blog,
  User,
  Readinglistitem,
}
