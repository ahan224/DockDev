import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({
    projects,
    params,
    delContainer,
    addFileWatcher,
    activeProject,
    startProject,
    stopProject,
    restartProject,
    removeProject,
  }) => {
  const proj = projects[params.uuid];
  const containers = R.toPairs(proj.containers)
    .map(cont =>
      <Container
        key={cont[0]}
        details={cont[1]}
        uuid={params.uuid}
        delContainer={delContainer}
      />
    );

  const start = () => startProject(params.uuid);
  const stop = () => stopProject(params.uuid);
  const restart = () => restartProject(params.uuid);
  const remove = () => removeProject(params.uuid);
  const watcher = () => addFileWatcher(params.uuid);

  return (
      <div className="project-wrapper">
        <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
          <h5 className="text-capitalize">
            {proj.projectName}
          </h5>
        </div>
          <div className="row">
            <div className="col-xs-12" id="servers">
              <h5>Servers</h5>
              <div className="divider"></div>
            </div>
            {containers}
          </div>
          <div className="row" >
            <div className="col-xs-12" id="databases">
              <h5>Databases</h5>
              <div className="divider"></div>
              {containers}
            </div>
          </div>
      </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  delContainer: React.PropTypes.func,
  addFileWatcher: React.PropTypes.func,
  activeProject: React.PropTypes.string,
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
};

export default ProjectDetail;
