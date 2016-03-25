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
    <div>
      <h4 className="display-4 text-capitalize">
        {proj.projectName}
      </h4>
      <p className="lead">
        All the awesome information about your project,
        container, are right here.  Take a look around.
      </p>
      <ul>
        {containers}
      </ul>
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default ProjectDetail;
