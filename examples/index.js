import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import App from './App'

const root = document.getElementById('root')

const render = (component) => {
  ReactDOM.render(
    <AppContainer>
      {component}
    </AppContainer>,
    root
  )
}

render(<App />)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(<NextApp />)
  })
}
