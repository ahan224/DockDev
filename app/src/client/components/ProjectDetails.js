import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({ projects, addContainer, params }) => {
  const proj = projects[params.uuid];
  const containers = R.toPairs(proj.containers)
    .map(container => <Container details={container} />);
  const wrapAdd = () => addContainer(proj.uuid);
  return (
    <div>
      <h1 className="display-4 text-capitalize">
        {proj.projectName}
      </h1>
      <p className="lead">
        All the awesome information about your project,
        container, are right here.  Take a look around.
      </p>
      <button onClick={wrapAdd}>Add Container</button>
      {containers}
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func
};

export default ProjectDetail;
