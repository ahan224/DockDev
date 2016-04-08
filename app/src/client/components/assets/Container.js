import React, { PropTypes } from 'react';

const Container = ({ container, onClick }) => {
  return (
    <div className="col-xs-12 col-md-6 col-lg-4">
      <div className="card text-xs-left">
        <div className="card-block">
          <h5 className="card-title">
          <button onClick={onClick}>Delete</button>
            { container.image }
            { container.status }
          </h5>
          <p className="card-text">
            URL
          </p>
        </div>
      </div>
    </div>
  );
};

Container.propTypes = {
  container: PropTypes.object,
  onClick: PropTypes.func,
};

export default Container;
