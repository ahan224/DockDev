'use strict';
'use-strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ipcRenderer = require('electron').ipcRenderer;
var sweetAlert = require('sweetalert2');
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
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      projects: ['test'],
      words: 'hello-world'
    };
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

  render: function render() {
    return React.createElement(
      'div',
      { className: 'pane-group' },
      React.createElement(SideMenu, null),
      React.createElement(ProjectList, { proj: this.state.projects, word: this.state.words }),
      React.createElement(ProjectDetailList, { proj: this.state.projects, word: this.state.words }),
      console.log(this.state.projects)
    );
  }
});

// SIDEMENU ////////////////////////////////////
// NOTE : Ul element where the side navigation and project list will populate
// Relationship: App > Sidemenu
// Children: TopNavList, ProjectList, BottomNavList
// /////////////////////////////////////////////
var SideMenu = React.createClass({
  displayName: 'SideMenu',

  handleAddProject: function handleAddProject(e) {
    console.log('created project');
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'pane-sm sidebar' },
      React.createElement(TopNavList, null),
      React.createElement(ProjectList, null),
      React.createElement(BottomNavList, null)
    );
  }
});

var TopNavList = React.createClass({
  displayName: 'TopNavList',

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
  handleClick: function handleClick(e) {
    return function openFile() {
      console.log(dialog.showOpenDialog({
        properties: ['openDirectory']
      }));
    };
  },

  render: function render() {
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

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  render: function render() {
    var _this = this;

    console.log(this.props.proj);
    console.log(this.props.word);
    if (this.props.proj.length > 0) {
      var children = this.props.proj.map(function (x) {
        return;
        React.createElement(
          'div',
          null,
          React.createElement(
            'li',
            { className: 'list-group-item active-projects', key: x },
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
                  _this.props.proj.name
                )
              )
            )
          )
        );
      });
      return React.createElement(
        'div',
        null,
        React.createElement(
          'ul',
          { className: ' list-group container-list container-links projects' },
          children
        )
      );
    } else {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          null,
          ';alsdkjf'
        )
      );
    }
  }
});

var BottomNavList = React.createClass({
  displayName: 'BottomNavList',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
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
      )
    );
  }
});

// PROJECTLIST ///////////////////////////////////
// NOTE : All active projects will be populated here
// /////////////////////////////////////////////
var ProjectDetailList = React.createClass({
  displayName: 'ProjectDetailList',

  handleClick: function handleClick(e) {
    console.log('running');
    return console.log(e);
  },

  render: function render() {
    console.log('am i here');
    if (this.props.proj.length) {
      var children = this.props.proj.map(function (x) {
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
    } else {
      return React.createElement(
        'div',
        { className: 'pane', id: 'main' },
        React.createElement(
          'div',
          { className: 'container main-content-wrapper' },
          React.createElement(
            'div',
            { className: 'card-group main-content-card-group ' },
            React.createElement(
              'button',
              { id: 'openFile', onClick: 'openFile()' },
              'Open'
            ),
            React.createElement(
              'button',
              { id: 'saveFile', onClick: this.handleClick },
              'Savafasdfe'
            )
          )
        )
      );
    }
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));