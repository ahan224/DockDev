// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

// ipcRenderer.on('asynchronous-reply', function(event, arg) {
//   console.log(arg); // prints "pong"
//
//
//   function openFile() {
//     console.log(dialog.showOpenDialog({
//       properties: ['openDirectory']
//     }));
//   }
// });

// addProject: function() {
//   return (<li className="list-group-item project">
//             <div className="media-body">
//               <div className="col-xs-2">
//               </div>
//               <div className="col-xs-10">
//                 <strong>List item title</strong>
//                 <!-- <p>Lorem ipsum dolor sit amet.</p> -->
//               </div>
//             </div>
//           </li>);
// }
//  handleClick: function(e){
//   return  swal({
//       title: "An input!",
//       text: 'Write something interesting:',
//       html: "<span class='btn btn-default btn-file'>Browse <input type='file'></input></span>",
//       showCancelButton: true,
//       closeOnConfirm: false,
//       animation: "slide-from-top"
//     }, function(inputValue){
//       console.log("You wrote", inputValue);
//       ipcRenderer.send('asynchronous-message', 'pik');
//     });
//  },
// var TopNavList = React.createClass({
//   handleClick: function(e){
      //  dialog.showOpenDialog({
      //    properties: ['openDirectory', 'createDirectory']
      //  }, function(event) {
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
          //
          // )
//   }
// });
