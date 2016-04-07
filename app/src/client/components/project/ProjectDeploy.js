import React from 'react';
import Gif from './assets/Gif';

const ProjectDeploy = ({ params, deployProject }) => {
  const image = [];
  const clickDeploy = () => {
    image.push(Gif);
    deployProject(params.uuid);
  };
  return (
    <div>
      <div className="alert alert-success" role="alert">
        <button onClick={clickDeploy}>Push</button>
      </div>
      <Gif />
    </div>
  );
};

ProjectDeploy.propTypes = {
  deployProject: React.PropTypes.func,
  params: React.PropTypes.object,
};

export default ProjectDeploy;
