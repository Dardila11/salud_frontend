import React, { Component } from 'react';

import { buttonToogle } from '../../../../js/sb-admin-2.min';
import { Link } from 'react-router-dom';

import './css/fontello.css';
import './navbarTop.styles.css';
import '../../../../vendor/fontawesome-free/css/all.min.css';

class NavBarTop extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <ul
        className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'
        id='accordionSidebar'
      >
        <a
          className='sidebar-brand d-flex align-items-center justify-content-center'
          href='index.html'
        >
          <div className='sidebar-brand-icon'>
            <i className='demo-icon icon-fa-salud'></i>
          </div>
          <div className='sidebar-brand-text mx-3 my-text'>ClinDesign</div>
        </a>
        <hr className='sidebar-divider my-0'></hr>
        <li className='nav-item active'>
          <a className='nav-link' href='index.html'>
            <i className='fas fa-fw fa-tachometer-alt'></i>
            <span>Administrador</span>
          </a>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='sidebar-heading'>Funciones</div>
        <li className='nav-item'>
          <Link role='button' className='nav-link' to={'/admin/users/'}>
            <i className='fas fa-fw fa-users-cog'></i>
            <span>Usuarios</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link role='button' className='nav-link' to={'/admin/studies/'}>
            <i className='fas fa-fw fa-notes-medical'></i>
            <span>Estudios</span>
          </Link>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='text-center d-none d-md-inline'>
          <button
            className='rounded-circle border-0'
            id='sidebarToggle'
            onClick={buttonToogle}
          ></button>
        </div>
      </ul>
    );
  }
}

export default NavBarTop;
