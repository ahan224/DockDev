import React from 'react';
import R from 'ramda';
import Container from './assets/Container';
import ProjButtons from './assets/ProjButtons';

const ProjectDetail = (props) => {

  const uuid = props.params.uuid;
  const proj = props.projects[uuid];

  const start = () => props.startProject(uuid);
  const stop = () => props.stopProject(uuid);
  const restart = () => props.restartProject(uuid);
  const remove = () => props.removeProject(uuid);

  const server = R.toPairs(proj.containers)
    .filter(cont => cont[1].server)
    .map(cont =>
      <Container
        key={cont[0]}
        details={cont[1]}
        uuid={uuid}
        delContainer={props.delContainer}
      >
        <ProjButtons start={start} stop={stop} restart={restart} remove={remove} />
      </Container>
    );

  const dbs = R.toPairs(proj.containers)
    .filter(cont => !cont[1].server)
    .map(cont =>
      <Container
        key={cont[0]}
        details={cont[1]}
        uuid={uuid}
        delContainer={props.delContainer}
      />
    );
  return (
    <div className="project-wrapper">
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
  startProject: React.PropTypes.func,
  stopProject: React.PropTypes.func,
  restartProject: React.PropTypes.func,
  removeProject: React.PropTypes.func,
};

export default ProjectDetail;
