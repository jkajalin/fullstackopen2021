const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogilista-model')
const User = require('../models/user')

let loginBaerer = 'empty baerer'

// Testing User related stuff
describe('When there is initially one user at db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('verysekret', 10)
    const user = new User({ kayttajanimi: 'root', passwordHash })

    await user.save()
  })

  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      kayttajanimi: 'mluukkai',
      nimi: 'Matti Luukkainen',
      salasana: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.kayttajanimi)
    expect(usernames).toContain(newUser.kayttajanimi)
  })

  test('Creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await testHelper.usersInDb()

    const newUser = {
      kayttajanimi: 'root',
      nimi: 'Superuser',
      salasana: 'salainen',
    }

    const result = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username must be unique and at least 3 characters')

    const usersAtEnd = await testHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
describe('User login tests', () => {
  // Adding user for blog creating and deleting test
  beforeAll(async () => {
    await User.deleteMany({})
    const salasanaHash = await bcrypt.hash('verysekret', 10)
    const user = new User({ kayttajanimi: 'root2', nimi: 'Root user',salasanaHash: salasanaHash })
    await user.save()
    //console.log(`käyttäjä ${user.kayttajanimi} luotu`)

  })

  test('User login fails with wrong pswd', async () => {
    const newUser = {
      kayttajanimi: 'root2',
      salasana: 'wrongpswd'
    }

    const result = await api
      .post('/api/login')
      .send(newUser)
      .expect(401)
    expect(result.body.token).not.toBeDefined

  })
  test('User is signed in sucressfully and token is placed', async () => {
    const newUser = {
      kayttajanimi: 'root2',
      salasana: 'verysekret'
    }

    const loginResult = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
    expect(loginResult.body.token).toBeDefined

    //console.log(`login bearer ${loginResult.body.token}`)

    loginBaerer = `bearer ${loginResult.body.token}` //Blog adding and manipulation tests dependent of this loginBaerer
  })
})
describe('There is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testHelper.initialBlogs)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(testHelper.initialBlogs.length)
  })

  describe('Viewing a specific blog', () => {
    test('_id is in id format', async () => {
      const blogsAtStart = await testHelper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      //console.log(JSON.stringify(resultBlog.body.id))
      expect(resultBlog.body.id).toBeDefined()
    })
  })
  describe('Addition of a new blog to list', () => {
    beforeAll(async () => {
      /*
      const newUser = {
        kayttajanimi: 'root2',
        salasana: 'verysekret'
      }

      const loginResult = await api
        .post('/api/login')
        .send(newUser)
        .expect(200)
      console.log('login baerer '+loginResult.body.token)
      loginBaerer = 'bearer '+loginResult.body.token
      */
    })


    test('Fail with no token in request', async () => {
      const newBlog = {
        title: 'New blog list item',
        author: 'JS supertest',
        url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
        likes: 5,
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(result.body.token).not.toBeDefined

    })

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New blog list item',
        author: 'JS supertest',
        url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
        likes: 5,
      }


      await api
        .post('/api/blogs')
        .set('Authorization', loginBaerer)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length +1)

      const contents = blogsAtEnd.map(n => n.title)
      expect(contents).toContain( 'New blog list item' )
    })

    test('if likes undefined, likes predefined to be zero', async () => {
      const newBlog = {
        title: 'Another blog list item',
        author: 'JS supertest',
        url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', loginBaerer)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      //expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)
      expect(blogsAtEnd[blogsAtEnd.length-1].title).toContain( 'Another blog list item' )
      expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0)
    })
    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        author: 'JS supertest 3',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', loginBaerer)
        .send(newBlog)
        .expect(400)

      //const blogsAtEnd = await testHelper.blogsInDb()
      //expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })

  })
  describe('Deletion of a blog', () => {
    test('Succeeds with status code 204 if id is valid', async () => {
      //console.log(`Print test in delete section ${loginBaerer}`)
      // Creating a new blog item for this user to be able to delete one
      const newBlog = {
        title: 'New blog list item',
        author: 'JS supertest',
        url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
        likes: 5,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', loginBaerer)
        .send(newBlog)

      const blogsAtStart = await testHelper.blogsInDb()
      //const blogToDelete = blogsAtStart[0]
      const blogToDelete = blogsAtStart[blogsAtStart.length-1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', loginBaerer)
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength( testHelper.initialBlogs.length )

      // Tarkistetaan että kyseisellä otsikolla olevaa blogilinkkiä ei enää esiinny listassa
      const contents = blogsAtEnd.map(r => r.title)
      expect(contents).not.toContain(blogToDelete.title)
    })
  })
  describe('Editing of a  blog item', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await testHelper.blogsInDb()

      const editedBlog = blogsAtStart[0]
      editedBlog.likes = 8

      await api
        .put(`/api/blogs/${editedBlog.id}`)
        .send(editedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd[0].likes).toBe(8)
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})