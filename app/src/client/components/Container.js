import React from 'react';

const Container = ({ details, delContainer, uuid }) => {
  const clickDelContainer = () => delContainer(uuid, details);
  return (
    <div className="col-xs-6 col-sm-4">
      <div className="card card-block">
        <h3 className="card-title">
        <button onClick={clickDelContainer}>Delete</button>
          { details.image }
          { details.status }
          <span className="version">v1.1.1.0</span>
        </h3>
        <p className="card-text">
          With supporting text below as a natural lead-in to additional content.
        </p>
        <a href="#" className=" pull-right">Details...</a>
      </div>
    </div>
  );
};

Container.propTypes = {
  details: React.PropTypes.object,
  delContainer: React.PropTypes.func,
  uuid: React.PropTypes.string,
};

export default Container;
