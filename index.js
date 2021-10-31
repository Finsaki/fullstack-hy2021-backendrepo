require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

/**
 * Aki K. 31.10.2021
 */

//setting up a custom morgan token that shows the req body data when the operation is a POST operation
// eslint-disable-next-line no-unused-vars
morgan.token('response-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
//setting up morgan with custom console message after CRUD operations are used
//I deleted '-' before response-time, because it signifies null and is very confusing to see in the middle of the message
app.use(morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

app.get('/', (req, res) => {
  res.send('<h1>Find the persons data at /api/persons</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(result => {
    //console.log(`Database contains ${result.length} entries`)
    const personsLength = result.length
    const dateNow = Date()
    res.send(`<div><p>Phonebook has info for ${personsLength} people</p><p>${dateNow}</p></div>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      console.log(person)
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  //console.log('BODY:', body)
  //console.log('HEADERS:', req.headers)
  const person = new Person ({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

//middlewaret ----------->

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
//Kaikkien muiden middlewarejen rekisteröinnin jälkeen!

app.use(errorHandler)

//<--------------middlewaret

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
