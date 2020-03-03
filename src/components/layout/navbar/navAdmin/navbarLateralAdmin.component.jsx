import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import '../css/fontello.css';
import '../navbarLateral.styles.css';

class NavBarLateralAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToogle: false
    };
  }

  render() {
    const path = window.location.pathname;
    
    const isActive =
      path.endsWith('/users') || path.endsWith('/users/') ? 0 : 1;
    return (
      <ul
        className={
          'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ' +
          (this.props.isToogle ? 'toggled' : '')
        }
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
            <span>Administrador</span>
          </a>          
        </li>
        <hr className='sidebar-divider mb-0'></hr>
        <li className='active nav-item hover'>
          <a className='nav-link' onClick={() => this.props.history.goBack()}>
            <i className="fas fa-caret-square-left"></i>
            <span>Retornar</span>
          </a>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='sidebar-heading'>Funciones</div>
        <li className={isActive === 0 ? 'active nav-item' : 'nav-item'}>
          <Link role='button' className='nav-link' to={'/admin/users/'}>
            <i className='fas fa-fw fa-users-cog'></i>
            <span>Usuarios</span>
          </Link>
        </li>
        <li className={isActive === 1 ? 'active nav-item' : 'nav-item'}>
          <Link role='button' className='nav-link' to={'/admin/studies/'}>
            <i className='fas fa-fw fa-notes-medical'></i>
            <span>Proyectos</span>
          </Link>
        </li>
        <hr className='sidebar-divider'></hr>
        <div className='text-center d-none d-md-inline'>
          <button
            className='rounded-circle border-0'
            id='sidebarToggle'
            onClick={this.props.handleToogle}></button>
        </div>
      </ul>
    );
  }
}

export default withRouter(NavBarLateralAdmin);
