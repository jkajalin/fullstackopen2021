import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query authorsdata{
    allAuthors  {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query booksdata{
    allBooks  {
      title
      author{
        id
        name
      }
      published
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres:[String]! ){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ){
      title
      author{        
        name
      }
      published
      id
    }
  }
`
export const EDIT_AUTHOR = gql`
 mutation editAuthor($name: String!, $born: Int!){
    editAuthor(
      name: $name,
      setBornTo: $born
    ){
      name
      born
    }
 }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const FIND_BOOKS_BY_GENRE = gql`
query findBooksByGenre($selectedGenre: String!){
  allBooks(genre: $selectedGenre) {
    title
    genres
    author {
      name
    }     
  }
}
`

export const ME = gql`
query user{
  me {
    username
    favoriteGenre
  }
}`
