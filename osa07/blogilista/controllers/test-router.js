const router = require('express').Router()
const Blog = require('../models/blogilista-model')
const User = require('../models/user')

// resets test db to empty state
router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router