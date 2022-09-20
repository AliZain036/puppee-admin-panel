import React, { Component } from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'

class Logout extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = ''
    if (process.env.NODE_ENV === 'production') {
      localStorage.removeItem('user')
    } else {
      localStorage.removeItem('user')
    }
    window.location.href = '/login'
  }

  render() {
    return <div></div>
  }
}

export default Logout
