import React from 'react';

const Container = (props) => {
  return (
    <div className="col-xs-12 col-md-6 col-lg-4">
      <div className="card text-xs-left">
        <div className="card-block">
          <h5 className="card-title">{ props.details[1].image }</h5>
          <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        </div>
      </div>
    </div>
  );
};

export default Container;
