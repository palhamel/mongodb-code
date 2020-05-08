import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'



// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model setup:
const Author = mongoose.model('Author', {
  name: String,
})

 // Seed db using Async:
const seedDatabase = async () => {
  // First clear database - then populate database:
  await Author.deleteMany()

  const tolkien = new Author({ name: 'J.R.R Tolkien' })
  await tolkien.save()

  const rowling = new Author({ name: 'J.K Rowling' })
  await rowling.save()
  
  console.log('Mr Robot here: hey hey Pål du e grymm')
}
seedDatabase()



// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
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

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})








// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
