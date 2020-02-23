import React, { Component } from 'react';

import { buttonToogle } from '../../../../js/sb-admin-2.min';
import { Link } from 'react-router-dom';

import './css/fontello.css';
import './navbarLateral.styles.css';
import '../../../../vendor/fontawesome-free/css/all.min.css';

class NavBarLateralProject extends Component {
  render() {
    const r = /members+/
    const path = window.location.pathname;
    console.log(path)
    const isActive = r.test(path) ? 0 : 1;
    return (
      <ul
        className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'
        id='accordionSidebar'>
        <a
          className='sidebar-brand d-flex align-items-center justify-content-center'
          href='index.html'>
          <div className='sidebar-brand-icon'>
            <i className='demo-icon icon-fa-salud'></i>
          </div>
          <div className='sidebar-brand-text my-text'>ClinDesign</div>
        </a>
        <hr className='sidebar-divider my-0'></hr>
        <li className='nav-item active'>
          <a className='nav-link' href='index.html'>
            <i className='fas fa-fw fa-tachometer-alt'></i>
            <span>Proyecto</span>
          </a>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='sidebar-heading'>Funciones</div>
        <li className={isActive == 0 ? 'active nav-item' : 'nav-item'}>
          <Link role='button' className='nav-link' to={'/admin/studies/' + path.split('/')[4]}>
            <i className='fas fa-fw fa-users-cog'></i>
            <span>Componentes</span>
          </Link>
        </li>
        {/* <li className={isActive == 1 ? 'active nav-item' : 'nav-item'}>
          <Link role='button' className='nav-link' to={path}>
            <i className='fas fa-fw fa-notes-medical'></i>
            <span>Estado</span>
          </Link>
        </li> */}
        <hr className='sidebar-divider'></hr>
        <div className='text-center d-none d-md-inline'>
          <button
            className='rounded-circle border-0'
            id='sidebarToggle'
            onClick={buttonToogle}></button>
        </div>
      </ul>
    );
  }
}

export default NavBarLateralProject;
