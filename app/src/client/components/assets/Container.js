import React, { PropTypes } from 'react';

const Container = ({ details, onClick, logo }) => (
  <div className="card-wrap">
    <div className="card">
      <img src={ logo } className="card-img" />
      <div>
        <button onClick={onClick}>Delete</button>
          { details.image }
          { details.status }
      </div>
    </div>
  </div>
);

Container.propTypes = {
  details: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
};

export default Container;
