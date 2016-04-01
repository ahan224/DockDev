import React from 'react';

const ProjectDeploy = ({ params, projects, DOToken, deployProject }) => {
  const clickDeploy = () => deployProject(projects[params.uuid], DOToken);
  return (
    <div>
      <div className="alert alert-success" role="alert">
        <button onClick={clickDeploy}>Deploy</button>
      </div>
    </div>
  );
};

ProjectDeploy.propTypes = {
  deployProject: React.PropTypes.func,
  params: React.PropTypes.object,
  projects: React.PropTypes.object,
  DOToken: React.PropTypes.string,
};

export default ProjectDeploy;
