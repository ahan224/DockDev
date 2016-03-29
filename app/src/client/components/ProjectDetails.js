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
  // console.log(projects[params.uuid]);
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
    <div className="col-xs-12">
      <h1 className="display-4 text-capitalize">
        {proj.projectName} Details
      </h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={restart}>Restart</button>
      <button onClick={remove}>Delete</button>
      <button onClick={watcher}>Watcher</button>
      <p className="lead">
        All the awesome information about your project,
        container, are right here.  Take a look around.
      </p>
      <div className="row">
        <div className="col-xs-12" id="servers">
          <h4>Servers</h4>
          <div className="divider"></div>
        </div>
        {containers}
      </div>
      <div className="row" id="databases">

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
