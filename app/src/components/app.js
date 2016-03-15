// main.js
const React = require('react');
const ReactDOM = require('react-dom');


let App = React.createClass({

  getInitialState: function() {
    return {windowWidth: window.innerWidth};
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

  render: function(){
    return(
      				<div className="pane-group">
      					<SideMenu/>
                <ProjectDetails/>
              {console.log('react yo')}
      				</div>
    )
  }
});

let SideMenu = React.createClass({
  handleAddProject: function(){
    console.log('created project');
  },

  render: function () {
    return (
       <div className="pane-sm sidebar">
         <ul className="list-group container-list container-links">
         <TopNav/>
         <ProjectItem/>
         <BottomNav/>
         </ul>
       </div>
    )
  }
});

let TopNav = React.createClass({
  render: function () {
    return (<li className="list-group-item add-container">
      <button type="button" name="button" onClick="">
        <span className=" icon ion-ios-plus-outline"></span>
      </button>
    </li>)
  }
});

let ProjectItem = React.createClass({
  render: function () {
    return (<li className="list-group-item active-projects">
      <div className="media-body project">
        <div className="col-xs-2">
        </div>
        <div className="col-xs-10">
          <strong>List item title</strong>
        </div>
      </div>
    </li>)
  }
});

let ProjectDetails = React.createClass({
  render: function(){
    return (<div className="pane" id="main">
      <div className="container main-content-wrapper">
        <div className="card-group main-content-card-group ">
          <ProjectDetailItem/>
        </div>
      </div>
    </div>)
  }
});

let ProjectDetailItem = React.createClass({
  render: function(){
    return (<div className="card dependancy col-xs-12">
              <div className="card-block">
                <h4 className="card-title">Title</h4>
                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <p className="card-text"><small className="text-muted">...</small></p>
              </div>
            </div>)
  }
});

let BottomNav = React.createClass({
  render: function(){
    return(  <ul className="list-group container-list bottom-nav">
              <li className="list-group-item options">
                <div className="col-xs-4">
                </div>
                <div className="col-xs-4">
                </div>
                <div className="col-xs-4">
                  <SettingsBtn/>
                </div>
              </li>
            </ul>)
  }
});

let SettingsBtn = React.createClass({
  render: function(){
    return (<button type="button" className="settings-btn">
              <span className="ion-ios-gear-outline"></span>
            </button>)
  }
});




ReactDOM.render(<App/>, document.getElementById('main'));
