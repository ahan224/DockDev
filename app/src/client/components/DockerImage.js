import React from 'react';

const DockerImage = ({ name, handler, style }) => (

  <div className="col-xs-6" onClick={handler} style={style}>
    <div className="card card-block">
      <h3 className="card-title">
            {name}
        <span className="version">.</span>
        <p className="collapse">Collapse</p>
      </h3>
      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
      <a href="#" className=" pull-right">Details...</a>
    </div>
  </div>
);

DockerImage.propTypes = {
  name: React.PropTypes.string,
  handler: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default DockerImage;


{/*<div onClick={handler} style={style}>
  {name}

</div>*/}
