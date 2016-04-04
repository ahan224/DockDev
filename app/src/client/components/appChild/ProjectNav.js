import React from 'react';
import ProjButtons from './appChildComp/ProjButtons';
import ProjNavLinks from './appChildComp/ProjNavLinks';

const ProjectNav = (props) => {
  const uuid = props.params.uuid;
  const proj = props.projects[uuid];

  const start = () => props.startProject(uuid);
  const stop = () => props.stopProject(uuid);
  const restart = () => props.restartProject(uuid);
  const remove = () => props.removeProject(uuid);

  return (
    <div >
      <div className="proj-nav">
        <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
          <h5 className="text-capitalize">
            {proj.projectName}
          </h5>
        </div>

        <ProjButtons start={start} stop={stop} restart={restart} remove={remove} />
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
  delContainer: React.PropTypes.func,
  activeProject: React.PropTypes.string,
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
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
