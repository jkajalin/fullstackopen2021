const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty bloglist is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple items it is calulated right', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test.only('is one with most likes', () => {
    const result = listHelper.favouriteBlog(testHelper.initialBlogs)
    expect(result.likes).toBe(12)
  })
})