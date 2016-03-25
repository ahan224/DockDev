import React from 'react';

const DockerImage = ({ name, handler }) => (
  <div onClick={handler}>
    {name}
  </div>
);

DockerImage.propTypes = {
  name: React.PropTypes.string,
  handler: React.PropTypes.func,
};

export default DockerImage;
