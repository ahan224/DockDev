'use strict';

//
var React = require('react');
var ReactDOM = require('react-dom');

// PARENT////////////////////////////////////
// NOTE : The parent will be the electron Window.
// /////////////////////////////////////////////
var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
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

  render: function render() {
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

  render: function render() {
    return React.createElement(
      'ul',
      { className: 'list-group container-list container-links topNav' },
      React.createElement(
        'li',
        { className: 'list-group-item add-container' },
        React.createElement(
          'button',
          { type: 'button', name: 'button', onClick: '' },
          React.createElement('span', { className: ' icon ion-ios-plus-outline' })
        )
      )
    );
  }
});

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  render: function render() {
    var _this = this;

    if (this.props.projects) {
      var children = this.props.projects.map(function (x) {
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
                _this.props.projects.name
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

var BottomNavList = React.createClass({
  displayName: 'BottomNavList',

  render: function render() {
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
var ProjectDetailList = React.createClass({
  displayName: 'ProjectDetailList',

  render: function render() {
    if (this.props.projects) {
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