import React from 'react';

const ProjectDetail = ({ projects, params }) => {
  const proj = projects[params.uuid];
  return (
    <div>
      <h1 className="display-4 text-capitalize">
        { proj.projectName }
      </h1>
      <p class="lead">
        All the awesome information about your project, container, are right here.  Take a look around.
      </p>
    </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default ProjectDetail;
