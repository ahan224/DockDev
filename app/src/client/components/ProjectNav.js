import React from 'react';
import { Router, Route, Link } from 'react-router'

const ProjectNav = ({ projects, addContainer, manageActiveProject, children, params, context }) => (
  <div id="content">
    <div className="content-top-nav">
      <ul className="nav nav-inline">
        <li className="nav-item">
          <Link className="nav-link" to={`/projects/${params.uuid}`}>General</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/projects/${params.uuid}/container`}>Add Container</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/projects/${params.uuid}/deploy`}>Deploy</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/projects/${params.uuid}/settings`}>Settings</Link>
        </li>
      </ul>

    </div>
    {React.cloneElement(children, { projects, manageActiveProject, addContainer, context })}
  </div>
);

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
  context: React.PropTypes.object
};


export default ProjectNav;
