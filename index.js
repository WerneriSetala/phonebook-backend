const express = require('express');
var morgan = require('morgan');
const app = express()
const cors = require('cors')

// json-parsija
app.use(express.json())

app.use(morgan('tiny'))

//uusi middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

app.use(cors())

// lista luettelon henkilöistä
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//puhelinluettelon info haku
app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const date = new Date();

    const fullInfo = `Phonebook has info for ${numberOfPersons} people <br>${date}`
    response.send(fullInfo)
})

// yksittäisen henkilön haku
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// kaikkien henkilöiden haku
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const generateId = (max) => {
    return (Math.floor(Math.random() * max) + 1).toString()
}

// yksittäisen henkilön lisäys
app.post('/api/persons', (request, response) => {

    // tarkistetaan, että nimi tai numero ei puutu
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // tarkistetaan, ettei nimi ole jo luettelossa
    if (persons.some(person => person.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const newPerson = {
        id: (generateId(100000)),
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(newPerson)
    console.log(newPerson)
    response.json(newPerson)
})

// yksittäisen henkilön poistaminen
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//käsittelemättömien virhetilanteiden käsittely
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

// backendin portin määritys
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})