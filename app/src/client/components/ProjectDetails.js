import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({ projects, params }) => {
  // console.log(projects);
  // for (var keys in projects) {
  //     console.log('KEYS:',projects[keys].uuid);
  //     console.log('KEYS:',projects[keys].projectName);
  //
  // }
  // console.log("params: ", params);
  // console.log("name:", projects.projectName);


  const proj = projects[params.uuid];
  const containers = R.toPairs(proj.containers)
    .map(container => <Container key={container[0]} details={container}>
                      </Container>

           );
  return (
    <div className="col-xs-12">
      <h1 className="display-4 text-capitalize">
        {proj.projectName} Details
      </h1>
      {/*<button>Start</button>
      <button>Stop</button>
      <button>Restart</button>
      <button>Delete</button>*/}
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
  params: React.PropTypes.object
};

export default ProjectDetail;
