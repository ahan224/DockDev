import React from 'react';

const Container = (props) => {
  return (
    <div className="col-xs-12 col-md-6 col-lg-4">
      <div className="card text-xs-left">
        <div className="card-block">
          <h4 className="card-title">{ props.details[1].image }</h4>
          <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        </div>
      </div>
    </div>
  );
};

export default Container;




{/*<div className="card card-block">
  <h5 className="card-header">
    { props.details[1].image }
    <span className="version">v1.1.1.0</span>
  </h5>
  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
  <a href="#" className=" pull-right">Details...</a>
</div>*/}
