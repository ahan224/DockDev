// modules/NavLink.js
import React from 'react'
import { Link } from 'react-router'

export default class NavLink React.createComponent({
  render() {
    return <Link {...this.props} activeClassName="active"/>
  }
})
