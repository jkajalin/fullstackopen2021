require('dotenv').config()
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const author = require('./models/author')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks( author: String, genre: String ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    addAuthor(
      name: String!
      born: Int
      bookCount: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async ( root, args ) => {
      authors = await Author.find({})
      books= await Book.find({})
      
      books.map( b => { b.author = authors.find( a => a.id.toString() === b.author.toString() )}  )
      if(!args.author && !args.genre){
        
        //return Book.find({}) // setting author field not implemented yet
        return books
      }
      if(args.genre && !args.author){
        return books.filter( b => b.genres.find( g => g === args.genre ) )
        //return Book.find({ genres: { $in: args.genre}}) //.filter( p => p.genres.find( g => g === args.genre ) )
        // setting author field not implemented yet...
      }
      if(args.genre && args.author){
        //console.log('books by genre from author')
        const authr1 = await Author.findOne({ name: args.author })
        console.log(authr1.name+' found, seek for books in genre')
        const boks = await Book.find({author: authr1})
        console.log(boks.length+' books found') // jatka seuraavasta rivistä
        //console.log(boks+' books')
        return boks.filter( p => p.genres.find( g => g === args.genre ) ) // fook... why this don't work // it kinda does, author field just still not implemented properly
        //return Book.find({}) //.filter( p => p.author === args.author ).filter( p => p.genres.find( g => g === args.genre ) )
      }
      const authr = await Author.findOne({ name: args.author})  //(await Author.find({})).filter(p => p.name === args.author)
      console.log(authr.name+' found')
      //const boks =  await Book.find({})
      // returnin books where author name is args.author
      return books.filter( b => b.author.id.toString() === authr.id.toString())
      //return Book.find({ author: authr}) //boks.filter( p => p.author === authr[0] ) // author: { $in: args.author}
    },
    allAuthors: async () => Author.find({})
  },
  Author: { 
    bookCount: async (root) => {
      const authr = await Author.findOne({ name: root.name})
      return (await Book.find({ author: authr})).length
    } //books.filter( p => p.author === root.name ).length,     
  },
  Mutation: {
    addBook: async( root, args ) => {
      //const book = { ... args, id: uuid() }
      const book = new Book( {...args } )

      console.log('author name: '+args.author)
      let bookAuthor = await Author.findOne({ name: args.author })
      
      if(!bookAuthor){
        const newAuthor = new Author( {name: args.author} )        
        try{
          bookAuthor = await newAuthor.save()
        } catch(error){
          throw new UserInputError(error.message, { invalidArgs: args, })
        }
      }
      book.author = bookAuthor.id
      //return book.save()
      
      //const book = new Book( {...args, author: new Author({ name: args.author}) })

      //const author = new Author({ name: args.author})
      /*
      if( books.find( p => p.title === args.title && p.author === args.author ) ){
        throw new UserInputError(`Book titled ${args.title} by author ${args.author} already exist`, { 
          invalidArgs: args.title
        })
      }else{
        books = books.concat(book)
      }
      if( authors.find( p => p.name === args.author ) === undefined ){
        const author = { name: args.author }
        authors = authors.concat(author)
      }
      */
      //return book
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError( error.message, { invalidArgs: args, } )
      }
      
      return book
    },
    editAuthor: async (root, args ) => {
      //const author = authors.find( p => p.name === args.name )
      const author = await Author.findOne({ name: args.name})
      if (!author){
        return null
      }
      
      author.born=args.setBornTo
      //authors = authors.map( p => p.name === args.name ? updauthor : p)
      //return updauthor
      
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError( error.message, { invalidArgs: args, } )
      }
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})