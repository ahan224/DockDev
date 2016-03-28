import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({ projects, params, delContainer }) => {
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

  return (
    <div className="col-xs-12">
      <h1 className="display-4 text-capitalize">
        {proj.projectName} Details
      </h1>
      <button type="button" className="btn btn-secondary">Restart</button>
      <button type="button" className="btn btn-secondary">Stop</button>
      <button type="button" className="btn btn-secondary">Start</button>
      <button type="button" className="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
        Popover on bottom
      </button>
      <button type="button" className="btn btn-secondary">Add</button>
      <button type="button" className="btn btn-secondary">Deploy</button>
      <button type="button" className="btn btn-secondary">Delete</button>
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
<<<<<<< HEAD
=======
  delContainer: React.PropTypes.func,
>>>>>>> 9321e8d77ebdfd05a0889efffb3bb6b44a8c84f7
};

export default ProjectDetail;
