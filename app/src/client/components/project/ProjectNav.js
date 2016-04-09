import React from 'react';
import ProjNavLinks from './assets/ProjNavLinks';

const ProjectNav = (props) => {
  const uuid = props.params.uuid;
  const proj = props.projects[uuid];


  return (
    <div>
      <div className="proj-nav">
        <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
          <h5 className="text-capitalize">
            {proj.projectName}
          </h5>
        </div>

        <ProjNavLinks uuid={uuid} />

      </div>
      {React.cloneElement(props.children, props)}
    </div>
  );
};

ProjectNav.propTypes = {
  children: React.PropTypes.object,
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
  context: React.PropTypes.object,
  activeProject: React.PropTypes.string,
  deployProject: React.PropTypes.func,
};


// projects,
// addContainer,
// delContainer,
// children,
// params,
// context,
// activeProject,
// startProject,
// stopProject,
// restartProject,
// removeProject,
// deployProject,

// projects,
// addContainer,
// context,
// delContainer,
// addFileWatcher,
// activeProject,
// startProject,
// stopProject,
// restartProject,
// removeProject,
// deployProject,

export default ProjectNav;
