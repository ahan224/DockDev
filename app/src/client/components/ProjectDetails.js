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
      <h3 className="text-capitalize">
        {proj.projectName} Details
      </h3>
      <div className="row">
        <div className="col-xs-12" id="servers">
          <h4>Servers</h4>
          <div className="divider"></div>
        </div>
        {containers}
      </div>
      <div className="row" id="databases">
        <h4>Databases</h4>
        <div className="divider"></div>
        {containers}
      </div>
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default ProjectDetail;


{/*<button type="button" className="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?" onClick={alertIT}>Click to toggle popover</button>*/}
