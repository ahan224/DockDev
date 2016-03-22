import React from 'react';
import NavLink from './NavLink';

export default ({ children }) => {
  return (
    <div>
      <div id="header">
        <h5>DockDev <small>beta</small></h5>
      </div>
      <ul role="nav" id="menu">
        <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/repos">Repos</NavLink></li>
        <li><NavLink to="/addProject">Add Project</NavLink></li>
        </ul>
      {children}
    </div>
  );
};
