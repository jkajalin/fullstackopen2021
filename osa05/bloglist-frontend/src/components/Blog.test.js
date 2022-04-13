import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let blogContainer

  const user = {
    token: 'tokenfoo',
    nimi: 'jussik'
  }

  const mockHandleLike = jest.fn()
  const mockHandleDelete = jest.fn()
  //const mockHandVisibility = jest.fn()

  beforeEach( () => {

    blog = {
      id: '62306bcbd5ea08c257241ce6',
      title: 'Nyt olis user extraktio eristetty middlewareksi',
      author: 'JK',
      url: 'longlong-foo-foo-url',
      likes: 5,
      user: '6229dda806cd0f6c2ad370f1'
    }

    blogContainer = render(<Blog blog={blog} handleLike={mockHandleLike} handleDel={mockHandleDelete} u={user} />).container
  })

  test('Blogin näyttävä komponentti renderöi blogin titlen, authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää', () => {
    /*
    const blog = {
      id: '62306bcbd5ea08c257241ce6',
      title: 'Nyt olis user extraktio eristetty middlewareksi',
      author: 'JK',
      url: 'longlong-foo-foo-url',
      likes: 5,
      user: '6229dda806cd0f6c2ad370f1'
    }
    */

    const element = screen.getByText(
      'Nyt olis user extraktio eristetty middlewareksi', { exact: false }
    )
    const author = screen.getByText(
      'JK', { exact: false }
    )
    expect(element).toBeDefined()
    expect(author).toBeDefined()
    const notvisible01 = screen.queryByText('longlong-foo-foo-url')
    const notvisible02 = screen.queryByText('likes')
    expect(notvisible01).toBeNull()
    expect(notvisible02).toBeNull()
  })

  test('Url ja likejen määrä näytetään kun blogin kaikki tiedot näyttävää nappia on painettu', () => {

    const button = screen.getByText('Nyt olis user extraktio eristetty middlewareksi - JK')
    userEvent.click(button)

    const likes = screen.getByText(
      'likes', { exact: false }
    )
    const url = screen.getByText(
      'longlong-foo-foo-url', { exact: false }
    )

    //screen.debug(blogContainer)

    const div = blogContainer.querySelector('.togglableContent')

    expect(likes).toBeDefined()
    expect(url).toBeDefined()

    expect(div).not.toHaveStyle('display: none')
  })

  test('Kun like-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa', () => {

    const button = screen.getByText('Like')
    userEvent.click(button)
    userEvent.click(button)

    expect(mockHandleLike.mock.calls).toHaveLength(2)
  })

})