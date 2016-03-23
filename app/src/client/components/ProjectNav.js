import React from 'react';
import { Link } from 'react-router';

const ProjectNav = ({ projects, children, params }) => (
  <div id="content">
    <ul>
      <li><Link to={`/projects/${params.uuid}`}>General</Link></li>
      <li><Link to={`/projects/${params.uuid}/settings`}>Settings</Link></li>
      <li><Link to={`/projects/${params.uuid}/deploy`}>Deploy</Link></li>
    </ul>
    {React.cloneElement(children, { projects })}
  </div>
);

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};


export default ProjectNav;
