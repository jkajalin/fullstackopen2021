require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = []
let books = []

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
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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
      //return Book.find({ author: authr}) // works, but author field don't have author data
      //boks.filter( p => p.author === authr[0] ) // author: { $in: args.author}
    },
    allAuthors: async () => Author.find({}),
    me: ( root, args, context ) => {
      return context.currentUser
    }
  },
  Author: { 
    bookCount: async (root) => {
      const authr = await Author.findOne({ name: root.name})
      return (await Book.find({ author: authr})).length
    } //books.filter( p => p.author === root.name ).length,     
  },
  Mutation: {
    addBook: async( root, args, context ) => {
      //const book = { ... args, id: uuid() }
      const book = new Book( {...args } )

      currentUser = context.currentUser

      if(!currentUser){
        throw new AuthenticationError( 'not authorized' )
      }

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
    editAuthor: async (root, args, context ) => {

      const currentUser = context.currentUser

      if(!currentUser){
        throw new AuthenticationError( 'Not authenticated' )
      }

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
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre }) // lyhyemmin ...args
      
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, { invalidArgs: args })
      })
    },
    login: async ( root, args ) => { 
      const user = await User.findOne( { username: args.username } )

      if( !user || args.password !== 'secret' ){
        throw new UserInputError( 'wrong credentials' )
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign( userForToken, JWT_SECRET ) }
     },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if( auth && auth.toLowerCase().startsWith('bearer ') ){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById( decodedToken.id ).populate('favoriteGenre')

      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})