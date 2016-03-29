import React from 'react';
import { Link } from 'react-router';

const ProjectNav = ({
    projects,
    addContainer,
    delContainer,
    manageProjects,
    children,
    params,
    context,
    addFileWatcher,
    activeProject,
  }) => (
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
    {React.cloneElement(children, {
      projects,
      addContainer,
      context,
      delContainer,
      manageProjects,
      addFileWatcher,
      activeProject,
    })}
  </div>
);

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
  context: React.PropTypes.object,
  delContainer: React.PropTypes.func,
  manageProjects: React.PropTypes.func,
  addFileWatcher: React.PropTypes.func,
  activeProject: React.PropTypes.string,
};


export default ProjectNav;
