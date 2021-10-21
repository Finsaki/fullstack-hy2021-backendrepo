const express = require('express')
const morgan = require('morgan')

/**
 * Aki K. 21.10.2021
 */

//setting up a custom morgan token that shows the request body data when the operation is a POST operation
morgan.token('response-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

const app = express()

app.use(express.json())
//setting up morgan with custom console message after CRUD operations are used
//I deleted '-' before response-time, because it signifies null and is very confusing to see in the middle of the message
app.use(morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Find the persons data at /api/persons</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const personsLength = persons.length
  const dateNow = Date()
  res.send(`<div><p>Phonebook has info for ${personsLength} people</p><p>${dateNow}</p></div>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  newPersons = persons.filter(person => person.id !== id)
  if (newPersons.length === persons.length - 1) {
    persons = newPersons
    response.status(204).end()
  } else {
    response.status(404).json({
      error: 'No person by given id found'
    })
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)
  //console.log(request.headers)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const generateId = () => {
  const newId = Math.floor(Math.random()*1000)
  console.log('Generated id:', newId)
  return newId
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
