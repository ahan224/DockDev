import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({
    projects,
    params,
    delContainer,
    startProject,
    stopProject,
    restartProject,
    removeProject,
  }) => {
  const proj = projects[params.uuid];
  const server = R.toPairs(proj.containers)
    .filter(cont => cont[1].server)
    .map(cont =>
      <Container
        key={cont[0]}
        details={cont[1]}
        uuid={params.uuid}
        delContainer={delContainer}
      />
    );

  const dbs = R.toPairs(proj.containers)
    .filter(cont => !cont[1].server)
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

  return (
    <div className="project-wrapper">
      <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
        <h5 className="text-capitalize">
            {proj.projectName}
        </h5>
      </div>
      <div className="btn-group container-player-btns" data-toggle="buttons">
        <label className="btn btn-primary active">
          <input type="radio" name="options" id="option1" autoComplete="off" checked onClick={start} />
                   <img src="./client/images/png/arrow@2x.png"></img>
        </label>
        <label className="btn btn-primary">
          <input type="radio" name="options" id="option2" autoComplete="off" onClick={stop} />
                   <img src="./client/images/png/shapes@2x.png"></img>
        </label>
        <label className="btn btn-primary">
          <input type="radio" name="options" id="option3" autoComplete="off" onClick={restart} />
                   <img src="./client/images/png/arrows@2x.png"></img>
        </label>
        <label className="btn btn-primary">
          <input type="radio" name="options" id="option3" autoComplete="off" onClick={remove} />
                   <img src="./client/images/png/arrows@2x.png"></img>
        </label>
      </div>
        <div className="row">
          <div className="col-xs-12" id="servers">
            <h5>Servers</h5>
            <div className="divider"></div>
          </div>
          {server}
        </div>
        <div className="row" >
          <div className="col-xs-12" id="databases">
            <h5>Databases</h5>
            <div className="divider"></div>
            {dbs}
          </div>
        </div>
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  delContainer: React.PropTypes.func,
  activeProject: React.PropTypes.string,
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
};

export default ProjectDetail;
