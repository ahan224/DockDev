'use strict';

//
const React = require('react');
const ReactDOM = require('react-dom');
<<<<<<< HEAD
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
=======
>>>>>>> master

// PARENT////////////////////////////////////
// NOTE : The parent will be the electron Window.
// /////////////////////////////////////////////
let App = React.createClass({
  displayName: 'App',

  getInitialState: function () {
    return { projects: [] };
  },
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

  render: function () {
    return React.createElement(
      'div',
      { className: 'pane-group' },
      React.createElement(SideMenu, null),
      React.createElement(ProjectList, null),
      console.log('react yo')
    );
  }
});

// SIDEMENU ////////////////////////////////////
// NOTE : Ul element where the side navigation and project list will populate
// Relationship: App > Sidemenu
// Children: TopNavList, ProjectList, BottomNavList
// /////////////////////////////////////////////
let SideMenu = React.createClass({
  displayName: 'SideMenu',

  handleAddProject: function (e) {
    console.log('created project');
  },

  render: function () {
    return React.createElement(
      'div',
      { className: 'pane-sm sidebar' },
      React.createElement(TopNavList, null),
      React.createElement(ProjectList, null),
      React.createElement(BottomNavList, null)
    );
  }
});

let TopNavList = React.createClass({
  displayName: 'TopNavList',

<<<<<<< HEAD
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
  handleClick: function (e) {
    return function openFile() {
      console.log(dialog.showOpenDialog({
        properties: ['openDirectory']
      }));
    };
  },

=======
>>>>>>> master
  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'ul',
        { className: 'list-group container-list container-links topNav' },
        React.createElement(
          'li',
          { className: 'list-group-item add-container' },
          React.createElement(
            'button',
            { type: 'button', name: 'button', onClick: this.handleClick },
            React.createElement('span', { className: ' icon ion-ios-plus-outline' })
          )
        )
      )
    );
  }
});

let ProjectList = React.createClass({
  displayName: 'ProjectList',

  render: function () {
    if (this.props.projects) {
      var children = this.props.projects.map(x => {
        return React.createElement(
          'li',
          { className: 'list-group-item active-projects' },
          React.createElement(
            'div',
            { className: 'media-body project' },
            React.createElement('div', { className: 'col-xs-2' }),
            React.createElement(
              'div',
              { className: 'col-xs-10' },
              React.createElement(
                'strong',
                null,
                this.props.projects.name
              )
            )
          )
        );
      });
    }

    return React.createElement(
      'ul',
      { className: ' list-group container-list container-links projects' },
      ' ',
      children,
      ' '
    );
  }
});

let BottomNavList = React.createClass({
  displayName: 'BottomNavList',

  render: function () {
    return React.createElement(
      'ul',
      { className: 'list-group container-list bottom-nav' },
      React.createElement(
        'li',
        { className: 'list-group-item add-container' },
        React.createElement(
          'button',
          { type: 'button', name: 'button', onClick: '' },
          React.createElement('img', { className: 'icon', src: './icons/Userinterface_setting-roll.svg' })
        )
      )
    );
  }
});

// PROJECTLIST ///////////////////////////////////
// NOTE : All active projects will be populated here
// /////////////////////////////////////////////
let ProjectDetailList = React.createClass({
  displayName: 'ProjectDetailList',

  render: function () {
    if (this.props.projects) {
      var children = this.props.projects.map(x => {
        return React.createElement(
          'div',
          { className: 'card dependancy col-xs-12' },
          React.createElement(
            'div',
            { className: 'card-block' },
            React.createElement(
              'h4',
              { className: 'card-title' },
              'Title'
            ),
            React.createElement(
              'p',
              { className: 'card-text' },
              'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
            ),
            React.createElement(
              'p',
              { className: 'card-text' },
              React.createElement(
                'small',
                { className: 'text-muted' },
                '...'
              )
            )
          )
        );
      });

      return React.createElement(
        'div',
        { className: 'pane', id: 'main' },
        React.createElement(
          'div',
          { className: 'container main-content-wrapper' },
          React.createElement(
            'div',
            { className: 'card-group main-content-card-group ' },
            children
          )
        )
      );
    } else {
      return;
    }
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));