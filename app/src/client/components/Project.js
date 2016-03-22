import React from 'react';
import R from 'ramda';

const Project = ({ projects, params }) => {
  const proj = R.toPairs(projects[params.id]);
  return (
    <div id="content">
      {proj}
    </div>
  );
};

Project.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default Project;
