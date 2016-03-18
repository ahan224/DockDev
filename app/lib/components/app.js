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
var utils = require('./lib/utils.js');

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
  getInitialState: function getInitialState() {
    return {
      projects: [],
      words: 'hello-world'
    };
  },

  handleProjects: function handleProjects(e) {
    this.setState({ projects: e });
    console.log(this.state);
  },

  componentDidUpdate: function componentDidUpdate() {
    console.log('state updated', this.state);
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'pane-group' },
      React.createElement(SideMenu, { projects: this.state.projects, handleProjects: this.handleProjects }),
      React.createElement(ProjectDetailList, { projects: this.state.projects }),
      '//  ',
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
      React.createElement(ProjectList, { projects: this.props.projects, handleProjects: this.props.handleProjects }),
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
    dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    }, function (event) {
      console.log(event);
      return swal({
        title: "An input!",
        text: 'Write something interesting:',
        html: "<input id='input-field'></input>",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top"
      }, function () {
        var _this = this;

        utils.initProject(event[0], $('#input-field').val()).then(function () {
          return console.log('saving:', _this.props.projects);
        }).then(function () {
          return _this.props.handleProjects(utils.memory);
        }).catch(console.log);
      });
    });
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
            'Add'
          )
        )
      )
    );
  }
});

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  render: function render() {
    console.log(this.props.projects);
    if (this.props) {
      var children = this.props.projects.map(function (x) {
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
                  x.name
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
            { type: 'button', name: 'button' },
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
    if (this.props.projects.length) {
      var children = this.props.projects.map(function (x) {
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
          React.createElement('div', { className: 'card-group main-content-card-group ' })
        )
      );
    }
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));