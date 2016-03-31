import React from 'react';
import { Link } from 'react-router';

const ProjectNav = ({
    projects,
    addContainer,
    delContainer,
    children,
    params,
    context,
    addFileWatcher,
    activeProject,
    startProject,
    stopProject,
    restartProject,
    removeProject,
  }) => (
  <div >
    <div className="proj-nav">
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
      </ul>
    </div>
    {React.cloneElement(children, {
      projects,
      addContainer,
      context,
      delContainer,
      addFileWatcher,
      activeProject,
      startProject,
      stopProject,
      restartProject,
      removeProject,
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
  addFileWatcher: React.PropTypes.func,
  activeProject: React.PropTypes.string,
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
};


export default ProjectNav;
