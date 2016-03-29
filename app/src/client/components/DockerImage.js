import React from 'react';

const DockerImage = ({ name, handler, style }) => (


       <div className="col-xs-12 col-md-6 col-lg-4">
         <div className="card text-xs-left">
           <div className="card-block">
             <h4 className="card-title">{ name }</h4>
             <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
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




//
{/*<div classNameName="col-xs-12 col-md-6 col-lg-4" onClick={handler} style={style}>
  <div classNameName="card text-xs-center">
    <div classNameName="card-header">
      {name}
    </div>
    <div classNameName="card-block">
      <h4 classNameName="card-title"></h4>
      <p classNameName="card-text">With supporting text below as a natural lead-in to additional content.</p>
      <a href="#" classNameName="btn btn-primary">Api Docs</a>
    </div>
    <div classNameName="card-footer text-muted">
      2 days ago
    </div>
  </div>
</div>*/}
// <div classNameName="col-xs-6" onClick={handler} style={style}>
//   <div classNameName="card card-block">
//     <h3 classNameName="card-title">
//           {name}
//       <span classNameName="version">.</span>
//     </h3>
//     <p classNameName="card-text">With supporting text below as a natural lead-in to additional content.</p>
//     <a href="#" classNameName=" pull-right">Details...</a>
//   </div>
// </div>


{/*<div onClick={handler} style={style}>
  {name}

</div>*/}
