import React from 'react';

const initPage = ({ params }) => <div>{params.id}</div>;

initPage.propTypes = {
  params: React.PropTypes.object
};

export default initPage;
