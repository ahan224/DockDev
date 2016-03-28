import React from 'react';
import R from 'ramda';
import Container from './Container';
import * as container from './server/container.js';

const ProjectDetail = ({ projects, params, delContainer, manageProjects }) => {
  const proj = projects[params.uuid];
  const containers = R.toPairs(proj.containers)
    .map(container =>
      <Container
        key={container[0]}
        details={container[1]}
        uuid={params.uuid}
        delContainer={delContainer}
      />
    );

  const start = () => manageProjects(container.start, params.uuid);
  const stop = () => manageProjects(container.stop, params.uuid);
  const restart = () => manageProjects(container.restart, params.uuid);
  const remove = () => manageProjects(container.remove, params.uuid);

  return (
    <div className="col-xs-12">
      <h1 className="display-4 text-capitalize">
        {proj.projectName} Details
      </h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={restart}>Restart</button>
      <button onClick={remove}>Delete</button>
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
  manageProjects: React.PropTypes.func,
};

export default ProjectDetail;
