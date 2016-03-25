import React from 'react';

const Container = (props) => {

  console.log('ContainerComponent: ',props);
  return (
    <div className="col-xs-6 col-sm-4">
      <div className="card card-block">
        <h3 className="card-title">
          { props.details[1].image }
          <span className="version">v1.1.1.0</span>
        </h3>
        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" className=" pull-right">Details...</a>
      </div>
    </div>
  );
};

export default Container;
