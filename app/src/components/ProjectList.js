import React from 'react';

const ProjectList = ({ projects }) => {
  return (
    <div>
      <p>ProjectList</p>
    </div>
  )
}

export default ProjectList;

// var ProjectList = React.createClass({
//   render: function () {
//     console.log(this.props.projects);
//     if (this.props) {
//       var children = this.props.projects.map((x)=> {
//             return
//               <div>
//                 <li className="list-group-item active-projects" key={x}>
//                   <div className="media-body project">
//                     <div className="col-xs-2">
//                     </div>
//                     <div className="col-xs-10">
//                       <strong>{x.name}</strong>
//                     </div>
//                   </div>
//                 </li>
//               </div>
//         });
//         return (
//           <div>
//             <ul className=" list-group container-list container-links projects">
//               {children}
//             </ul>
//           </div>)
//     }
//     else {
//       return (<div><h2>;alsdkjf</h2></div>);
//     }
//   }
// });
