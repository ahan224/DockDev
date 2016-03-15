'use strict';

// main.js
const React = require('react');
const ReactDOM = require('react-dom');

let App = React.createClass({
  displayName: 'App',

  getInitialState: function () {
    return { windowWidth: window.innerWidth };
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
      React.createElement(ProjectDetails, null),
      console.log('react yo')
    );
  }
});

let SideMenu = React.createClass({
  displayName: 'SideMenu',

  handleAddProject: function () {
    console.log('created project');
  },

  render: function () {
    return React.createElement(
      'div',
      { className: 'pane-sm sidebar' },
      React.createElement(
        'ul',
        { className: 'list-group container-list container-links' },
        React.createElement(TopNav, null),
        React.createElement(ProjectItem, null),
        React.createElement(BottomNav, null)
      )
    );
  }
});

let TopNav = React.createClass({
  displayName: 'TopNav',

  render: function () {
    return React.createElement(
      'li',
      { className: 'list-group-item add-container' },
      React.createElement(
        'button',
        { type: 'button', name: 'button', onClick: '' },
        React.createElement('span', { className: ' icon ion-ios-plus-outline' })
      )
    );
  }
});

let ProjectItem = React.createClass({
  displayName: 'ProjectItem',

  render: function () {
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
            'List item title'
          )
        )
      )
    );
  }
});

let ProjectDetails = React.createClass({
  displayName: 'ProjectDetails',

  render: function () {
    return React.createElement(
      'div',
      { className: 'pane', id: 'main' },
      React.createElement(
        'div',
        { className: 'container main-content-wrapper' },
        React.createElement(
          'div',
          { className: 'card-group main-content-card-group ' },
          React.createElement(ProjectDetailItem, null)
        )
      )
    );
  }
});

let ProjectDetailItem = React.createClass({
  displayName: 'ProjectDetailItem',

  render: function () {
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
  }
});

let BottomNav = React.createClass({
  displayName: 'BottomNav',

  render: function () {
    return React.createElement(
      'ul',
      { className: 'list-group container-list bottom-nav' },
      React.createElement(
        'li',
        { className: 'list-group-item options' },
        React.createElement('div', { className: 'col-xs-4' }),
        React.createElement('div', { className: 'col-xs-4' }),
        React.createElement(
          'div',
          { className: 'col-xs-4' },
          React.createElement(SettingsBtn, null)
        )
      )
    );
  }
});

let SettingsBtn = React.createClass({
  displayName: 'SettingsBtn',

  render: function () {
    return React.createElement(
      'button',
      { type: 'button', className: 'settings-btn' },
      React.createElement('span', { className: 'ion-ios-gear-outline' })
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));