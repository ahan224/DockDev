import React from 'react';
import R from 'ramda';

const Project = ({ projects, params }) => {
  const proj = R.toPairs(projects[params.uuid]);
  return (
    <div>
      {proj}
    </div>
  );
};

Project.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default Project;
