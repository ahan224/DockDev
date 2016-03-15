// main.js
const React = require('react');
const ReactDOM = require('react-dom');


let App = React.createClass({

  getInitialState: function() {
    return {windowWidth: window.innerWidth};
  },
  // addProject: function() {
  //   return (<li class="list-group-item project">
  //             <div class="media-body">
  //               <div class="col-xs-2">
  //               </div>
  //               <div class="col-xs-10">
  //                 <strong>List item title</strong>
  //                 <!-- <p>Lorem ipsum dolor sit amet.</p> -->
  //               </div>
  //             </div>
  //           </li>);
  // }

  render: function(){
    return(<div> <h4>react is connected</h4> </div>);
  }
});

let SideMenu = React.createClass({
  render: function () {
    return (

    );
  }
});






ReactDOM.render(<App/>, document.getElementById('main'));
