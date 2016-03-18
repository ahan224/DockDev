import React from 'react';

const TopNavList = () => {
  return (
    <div>
      <p>TopNavList</p>
    </div>
  )
}

export default TopNavList;

// var TopNavList = React.createClass({
//   handleClick: function(e){
//        dialog.showOpenDialog({
//          properties: ['openDirectory', 'createDirectory']
//        }, function(event) {
//          console.log(event);
//          return  swal({
//                title: "An input!",
//                text: 'Write something interesting:',
//                html: "<input id='input-field'></input>",
//                showCancelButton: true,
//                closeOnConfirm: false,
//                animation: "slide-from-top"
//              }, function(){
//                utils.initProject(event[0], $('#input-field').val())
//                 .then(function(){
//                   return this.props.handleProjects(utils.memory)
//                 })
//
//              });
//        });
//   },
//
//   render : function(){
//     return (
//               <div>
//                 <ul className="list-group container-list container-links topNav">
//                   <li className="list-group-item add-container">
//                   <button type="button" name="button" onClick={this.handleClick}>
//                   Add
//                   </button>
//                 </li>
//                 </ul>
//               </div>
//           )
//   }
// });
