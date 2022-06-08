const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
//const Blog = require('../models/blogilista-model')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title:1, url:1, likes:1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { kayttajanimi, nimi, salasana } = request.body

  const existingUser = await User.findOne({ kayttajanimi })
  if (existingUser) {
    return response.status(400).json({
      error: 'Username must be unique and at least 3 characters'
    })
  }

  if(salasana.length < 3){
    response.status(400).json({ error: 'Password must be longer than 3 characters' })
  }
  const saltRounds = 10
  const salasanaHash = await bcrypt.hash(salasana, saltRounds)

  const user = new User({
    kayttajanimi,
    nimi,
    salasanaHash: salasanaHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
