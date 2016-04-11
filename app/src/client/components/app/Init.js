import React from 'react';

const InitPage = ({ }) => (

<div className="loader-wrapper">
  <main>
    <div className="wrapper">
      <aside className="aside aside-1-loader">
        <img src="./client/images/png/DD-icon-text@2x.png"></img>
      </aside>
      <aside className="aside">

      </aside>
      <aside className="aside aside-2-loader load-text">
       There was a problem setting up our application on your Mac.
       Please check to make sure that you have docker installed:
       <a href="https://www.docker.com/products/docker-toolbox">Install Docker</a>
       After installing docker, or if you already have Docker installed, Please
      </aside>
    </div>
  </main>
</div>
);

InitPage.propTypes = {
  params: React.PropTypes.object,
};

export default InitPage;
