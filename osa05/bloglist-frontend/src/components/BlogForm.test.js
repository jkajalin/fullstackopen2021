import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('Lomake kutsuu propseina saamaansa takaisinkutsufunktiota oikeilla tiedoilla siinä vaiheessa kun blogi luodaan', async () => {

    const mockCreateBlog = jest.fn()

    const bfrmContainer = render(<BlogForm createBlog={mockCreateBlog} />).container

    const titleInput = bfrmContainer.querySelector('#title-input')
    const authorInput = bfrmContainer.querySelector('#author-input')
    const urlInput = bfrmContainer.querySelector('#url-input')

    const createButton = screen.getByText('Create')


    userEvent.type(titleInput, 'still Testing a blog form' )
    userEvent.type(authorInput, 'JKajalin' )
    userEvent.type(urlInput, 'some-foo000-url' )

    expect(titleInput).toHaveValue('still Testing a blog form')
    expect(authorInput).toHaveValue('JKajalin')
    expect(urlInput).toHaveValue('some-foo000-url')

    //screen.debug(titleInput)
    //screen.debug(authorInput)
    //screen.debug(urlInput)

    userEvent.click(createButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)

  })

})