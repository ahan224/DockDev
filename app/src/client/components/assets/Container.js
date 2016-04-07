import React from 'react';

const Container = ({ container }) => {
  const clickDelContainer = '';
  return (
    <div className="col-xs-12 col-md-6 col-lg-4">
      <div className="card text-xs-left">
        <div className="card-block">
          <h5 className="card-title">
          <button onClick={clickDelContainer}>Delete</button>
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
  container: React.PropTypes.object,
};

export default Container;
