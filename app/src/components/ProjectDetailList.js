import React from 'react';

// PROJECTLIST ///////////////////////////////////
// NOTE : All active projects will be populated here
// /////////////////////////////////////////////
var ProjectDetailList = React.createClass({

  handleClick: function(e) {
    console.log('running');
    return console.log(e);
  },

  render: function(){
    if (this.props.projects.length) {
      var children = this.props.projects.map((x)=> {
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
            </div>
          </div>
        </div>)
    }

  }
});
