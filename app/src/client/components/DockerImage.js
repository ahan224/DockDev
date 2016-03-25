import React from 'react';

const DockerImage = ({ name, handler, style }) => (
  <div onClick={handler} style={style}>
    {name}
  </div>
);

DockerImage.propTypes = {
  name: React.PropTypes.string,
  handler: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default DockerImage;
