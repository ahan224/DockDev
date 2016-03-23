import React from 'react';

const ProjectDetail = ({ projects, params }) => {
  const proj = projects[params.uuid];
  return (
    <div>
      {proj.projectName}
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default ProjectDetail;
