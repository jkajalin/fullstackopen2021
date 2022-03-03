const mongoose = require('mongoose')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogilista-model')



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
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New blog list item',
        author: 'JS supertest',
        url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
        likes: 5,
      }

      await api
        .post('/api/blogs')
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
        .send(newBlog)
        .expect(400)

      //const blogsAtEnd = await testHelper.blogsInDb()
      //expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })

  })
  describe('Deletion of a blog', () => {
    test('Succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength( testHelper.initialBlogs.length -1 )

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