const mongoose = require('mongoose')

//There needs to be 3 or 5 arguments.
if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(`Incorrect amount of arguments: ${process.argv.length}. GET needs 3 arguments, POST needs 5 arguments.`)
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://kiki-ko_21:${password}@cluster0.jabzf.mongodb.net/phonebook-app?retryWrites=true`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//if 3 arguments then only password was given, and will show print the contents of the database
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
//if 5 arguments then name and number were also given in addition to password, and will save them to database
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}