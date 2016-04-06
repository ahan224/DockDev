import React from 'react';
import ProjectLinks from './ProjectLinks';
import NavLink from './NavLink';

const LeftNav = ({ projects, exampleClick }) => (
  <ul role="nav" id="menu" className="nav">
    <li className="search-wrapper">
      {/* <input className="main-search-input"></input>*/}
        {/* <span className="input-group-addon">
          <img src="./client/images/png/search.png"></img>
        </span>*/}
    </li>
    <li className="nav-item proj-anchor">
      <NavLink to="/" onlyActiveOnIndex>
        <label onClick={exampleClick}>
          Projects
        </label>
      </NavLink>
    </li>
    <li className="add-proj-wrapper">
      <NavLink to="/addProject" className="add-proj-icon">
        <img src="./client/images/png/addIcon@2x.png"></img>
      </NavLink>
    </li>
    <ProjectLinks projects={projects} />
  </ul>
);

LeftNav.propTypes = {
  projects: React.PropTypes.object,
  exampleClick: React.PropTypes.func,
};

export default LeftNav;
