import React from 'react'

import { configureStore } from '@reduxjs/toolkit'
import { reducers } from './reducers'
import {thunk} from 'redux-thunk'

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware=>getDefaultMiddleware().concat(thunk),
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)