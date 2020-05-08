import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'



// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Two models with an relationship between them:
// Mongoose model setup:

  // Author Model
const Author = mongoose.model('Author', {
  name: String,
})
  // Book Model (connect author to model Author above)
const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

// RESTART_DATABASE npm run dev:
if (process.env.RESET_DATABASE) {
  console.log('Resetting database')
    // Seed db using Async:
  const seedDatabase = async () => {
    // First clear database - then populate database:
    await Author.deleteMany()
    await Book.deleteMany()

    const tolkien = new Author({ name: 'J.R.R Tolkien' })
    await tolkien.save()

    const rowling = new Author({ name: 'J.K Rowling' })
    await rowling.save()

    //some new data:
    await new Book({ title: "Harry Potter and the Philosopher's Stone", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Order fo Phoenix", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Half-Blood Prince", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
    await new Book({ title: "Lord of the Rings", author: tolkien }).save()
    await new Book({ title: "The Hobbit", author: tolkien }).save()
  }
  seedDatabase()
}



// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello WWworld')
})

// a RESTful route to return all Authors:
// http://localhost:8080/authors
app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

// Get Author info per id
// Could include Error message if not exist
// http://localhost:8080/authors/5eb533a67493b43b4b0a34ca
app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
    res.json(author)
})


// return all books by Authors id
// include Error message if not exist - NOT WORKING??
// http://localhost:8080/authors/5eb533a67493b43b4b0a34ca/books
app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

// Books including the author ref from _id in Author:
// http://localhost:8080/books
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})






// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
