'use strict';

// main.js
const React = require('react');
const ReactDOM = require('react-dom');

// PARENT////////////////////////////////////
// NOTE : The parent will be the electron Window
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

  render: function () {

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

// let TopNavItem = React.createClass({
//   render: function () {
//     return (<li className="list-group-item add-container">
//       <button type="button" name="button" onClick="">
//         <span className=" icon ion-ios-plus-outline"></span>
//       </button>
//     </li>)
//   }
// });

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

// let ProjectDetailItem = React.createClass({
//   render: function(){
//     return (<div className="card dependancy col-xs-12">
//               <div className="card-block">
//                 <h4 className="card-title">Title</h4>
//                 <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
//                 <p className="card-text"><small className="text-muted">...</small></p>
//               </div>
//             </div>)
//   }
// });

// let SettingsBtn = React.createClass({
//   render: function(){
//     return (<button type="button" className="settings-btn">
//               <span className="ion-ios-gear-outline"></span>
//             </button>)
//   }
// });

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));