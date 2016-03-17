'use-strict';
import 'babel-polyfill'
const React = require('react');
const ReactDOM = require('react-dom');
const ipcRenderer = require('electron').ipcRenderer;
const sweetAlert = require('sweetalert2');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');
var path = require('path');
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

// PARENT////////////////////////////////////
// NOTE : The parent will be the electron Window.
// /////////////////////////////////////////////
var App = React.createClass({
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
  getInitialState: function() {
    return {
      projects: ['test'],
      words: 'hello-world'
    };
  },

  render: function(){
    return(<div className="pane-group">
    					<SideMenu projects={this.state}/>
              <ProjectList />
              <ProjectDetailList projects={this.state.projects}/>
              //  {console.log(this.state.projects)}

    			 </div>)
  }
});


// SIDEMENU ////////////////////////////////////
// NOTE : Ul element where the side navigation and project list will populate
// Relationship: App > Sidemenu
// Children: TopNavList, ProjectList, BottomNavList
// /////////////////////////////////////////////
var SideMenu = React.createClass({
  handleAddProject: function(e){
    console.log('created project');
  },

  render: function () {
    return (
       <div className="pane-sm sidebar">
         <TopNavList/>
         <ProjectList projects={this.props.projects}/>
         <BottomNavList/>
       </div>
    )
  }
});


var TopNavList = React.createClass({
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
  handleClick: function(e){
   return  function openFile() {
       console.log(dialog.showOpenDialog({
         properties: ['openDirectory']
       }));
     }
  },

  render : function(){
    return (
              <div>
                <ul className="list-group container-list container-links topNav">
                  <li className="list-group-item add-container">
                  <button type="button" name="button" onClick={this.handleClick}>
                  <span className=" icon ion-ios-plus-outline"></span>
                  </button>
                </li>
                </ul>
              </div>
          )
  }
});

var ProjectList = React.createClass({
  render: function () {
    console.log(this.props.projects);
    if (this.props) {
      var children = this.props.map((x)=> {
            return
              <div>
                <li className="list-group-item active-projects" key={x}>
                  <div className="media-body project">
                    <div className="col-xs-2">
                    </div>
                    <div className="col-xs-10">
                      <strong>{this.props.projects.name}</strong>
                    </div>
                  </div>
                </li>
              </div>
        });
        return (
          <div>
            <ul className=" list-group container-list container-links projects">
              {children}
            </ul>
          </div>)
    }
    else {
      return (<div><h2>;alsdkjf</h2></div>);
    }
  }
});

var BottomNavList = React.createClass({
  render: function(){
      return(
               <div>
                 <ul className="list-group container-list bottom-nav">
                   <li className="list-group-item add-container">
                     <button type="button" name="button" onClick="">
                       <img className="icon" src="./icons/Userinterface_setting-roll.svg">
                       </img>
                     </button>
                   </li>
                 </ul>

               </div>)
            }
});

// PROJECTLIST ///////////////////////////////////
// NOTE : All active projects will be populated here
// /////////////////////////////////////////////
var ProjectDetailList = React.createClass({

  handleClick: function(e){
    console.log('running');
    return console.log(e);
  },

  render: function(){
    console.log('am i here');
    if (this.props.proj.length) {
      var children = this.props.proj.map((x)=> {
        return (<div className="card dependancy col-xs-12">
                <div className="card-block">
                <h4 className="card-title">Title</h4>
              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p className="card-text"><small className="text-muted">...</small></p>
          </div>
          </div>)
        });

        return (
          <div className="card dependancy col-xs-12">
                  <div className="card-block">
                  <h4 className="card-title">Title</h4>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
              <p className="card-text"><small className="text-muted">...</small></p>
            </div>
            </div>
          )
    }
    else {
      return (
        <div className="pane" id="main">
          <div className="container main-content-wrapper">
            <div className="card-group main-content-card-group ">
            <button id="openFile" onClick="openFile()">Open</button>
            <button id="saveFile" onClick={this.handleClick}>Savafasdfe</button>
            </div>
          </div>
        </div>)
    }

  }
});



ReactDOM.render(<App/>, document.getElementById('main'));
