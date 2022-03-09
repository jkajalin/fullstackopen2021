const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { kayttajanimi, nimi, salasana } = request.body

  const saltRounds = 10
  const salasanadHash = await bcrypt.hash(salasana, saltRounds)

  const user = new User({
    kayttajanimi,
    nimi,
    passwordHash: salasanadHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
