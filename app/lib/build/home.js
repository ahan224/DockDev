'use strict';

// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var DockDev = React.createClass({
  displayName: 'DockDev',

  getInitialState: function () {
    return { windowWidth: window.innerWidth };
  },

  render: function () {
    return React.createElement(
      'div',
      null,
      ' ',
      React.createElement(
        'h4',
        null,
        'react is connected'
      ),
      ' '
    );
  }
});

ReactDOM.render(React.createElement(DockDev, null), document.getElementById('main'));