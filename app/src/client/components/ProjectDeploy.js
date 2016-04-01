import React from 'react';

const ProjectDeploy = ({ params, deployProject }) => {
  const clickDeploy = () => deployProject(params.uuid);
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
};

export default ProjectDeploy;
