import React from 'react';

const DockerImage = ({ name, handler, style }) => (

       <div className="col-xs-12 col-md-6 col-lg-4">
         <div className="card text-xs-left">
           <div className="card-block" onClick={handler} style={style}>
             <h5 className="card-title">{name}</h5>
             <p className="card-text">
              With supporting text below as a natural lead-in to additional content.
            </p>
           </div>
         </div>
       </div>
);

DockerImage.propTypes = {
  name: React.PropTypes.string,
  handler: React.PropTypes.func,
  style: React.PropTypes.object,
};

export default DockerImage;
