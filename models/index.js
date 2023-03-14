const Blog = require('./blog')
const User = require('./user')
const Readinglistitem = require('./readinglistitem')
const ActiveSession = require('./activeSession')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglistitem, as: 'readings' })
Blog.belongsToMany(User, { through: Readinglistitem, as: 'usersSaved' })

User.hasOne(ActiveSession)

module.exports = {
  Blog,
  User,
  Readinglistitem,
  ActiveSession,
}
