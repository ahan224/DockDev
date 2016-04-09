import React from 'react';

const Container = ({ details, delContainer, uuid, buttons }) => {
  const clickDelContainer = () => delContainer(uuid, details);
  return (
    <div className="col-xs-12 col-md-6 col-lg-4">
      <div className="card text-xs-left">
        <div className="card-block">
          <h5 className="card-title">
          <button onClick={clickDelContainer}>Delete</button>
            { details.image } - status: { details.status }
          </h5>
          {buttons}
          <p className="card-text">
            With supporting text below as a natural lead-in to additional content.
          </p>
        </div>
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
