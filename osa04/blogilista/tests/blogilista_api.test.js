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
})


afterAll(() => {
  mongoose.connection.close()
})