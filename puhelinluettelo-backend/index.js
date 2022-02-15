/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('build'))

// eslint-disable-next-line no-unused-vars
morgan.token('postdata', function (req, _res) { return JSON.stringify(req.body) })
app.use(morgan(':postdata',{

  // eslint-disable-next-line no-unused-vars
  skip: function (req,_res) {return req.method !== 'POST'}
}))

const requestLogger = (request, _response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

/*
let persons = [
    {
        name: "Arto Hellas",
        phone: "040-654321",
        id: 1
      },
      {
        name: "Ada Lovelace",
        phone: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        phone: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        phone: "39-23-6423122",
        id: 4
      },
      {
        name: "Bart Simpson",
        phone: "1234567",
        id: 5
      },
      {
        name: "Homer Simpson",
        phone: "0987654",
        id: 6
      },
      {
        name: "Lisa Simpson",
        phone: "0457778684",
        id: 7
      }
  ]
  */

app.get('/', (_request, response) => {
  response.send('<h1>Hola amigos!</h1>')
})

app.get('/api/persons', (_req, res, next) => {
  Person.find({}).then( persons => {
    if(persons){
      res.json(persons)
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.get('/info', (_request, response, next) => {
  Person.find({})
    .then( persons => {
      if(persons){
        response.send(`
          Phonebook has info for ${persons.length} persons
          <br />
          ${new Date()}
        `)
      }else{
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  //const id = String(request.params.id)

  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  //persons = persons.filter(person => person.id !== id)
  Person.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(_result => {
      response.status(204).end()
    }).catch(error => next(error))

})

/*
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

/*
const generateId = () => {
    const minId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return getRandomInt(minId+1, 100000)
}
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('body.name: '+body.name)

  /*
    if (body.name === undefined && !body.name) {
      return response.status(400).json({ error: 'name missing' })
    }
    /*
    if (!body.name) {
        return response.status(400).json({
          error: 'name missing'
        })
    }
    */
  const person = new Person({
    name: body.name,
    phone: body.phone,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON() )
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))

  /*
    const nameExist= persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
    if( nameExist ){
      console.log("Name exist!")
      console.log(`Name must be unique, ${body.name} already added.`)
      return response.status(400).json({
        error: `Name must be unique, ${body.name} already added.`
      })
    }
    if (!body.phone) {
        return response.status(400).json({
          error: 'phone missing'
        })
    }

    const person = {
      name: body.name,
      phone: body.phone,
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
    */
})

app.put('/api/persons/:id',(request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    phone: body.phone,
  }
  console.log('Päivitetään '+person.name+' '+request.params.id)
  Person.findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint) // olemattomien osoitteiden käsittely

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)  // virheellisten pyyntöjen käsittely

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})