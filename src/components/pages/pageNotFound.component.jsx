import React from 'react';
import './pageNotFound.styles.css';

const PageNotFound = () => {
  return (
    <div className='h-100 container-fluid d-flex justify-content-center align-items-center'>
      <div className='row'>
        <div className='col-12'>
          <div className='page404-custom d-block col-12'></div>
        </div>
        <div className='col-12 text-center'>
          <h1 className='col-12'>ERROR 404</h1> <br />
          <h4>La página solicitada no existe.</h4>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
