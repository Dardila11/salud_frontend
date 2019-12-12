import React, { Component } from 'react';
import axios from 'axios';

import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { buttonToogle } from '../../../js/sb-admin-2.min';
import { closeSession } from '../../utils/handleLocalStorage';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';

import './navbar.styles.css';

class NavBar extends Component {
  email = JSON.parse(localStorage.getItem('email'));

  constructor(props) {
    super(props);
    this.state = {
      isLogged: true
    };
  }

  onLogout = () => {
    const headers = getHeader();
    axios.delete(URL + '/users/logout/', { headers: headers }).then(() => {
      closeSession();
      this.setState({ isLogged: false });
    });
  };

  render() {
    if (!this.state.isLogged) {
      return <Redirect to='/' />;
    }
    return (
      <nav className='navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow'>
        <button
          id='sidebarToggleTop'
          className='btn btn-link d-md-none rounded-circle mr-3'
          onClick={buttonToogle}
        >
          <i className='fa fa-bars'></i>
        </button>
        <form className='d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control bg-light border-0 small'
              placeholder='Buscar...'
              aria-label='Search'
              aria-describedby='basic-addon2'
            ></input>
            <div className='input-group-append'>
              <button className='btn btn-primary' type='button'>
                <i className='fas fa-search fa-sm'></i>
              </button>
            </div>
          </div>
        </form>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item dropdown no-arrow mx-1'>
            <Dropdown alignRight>
              <Dropdown.Toggle className='button-miss'>
                <div className='d-flex aling-content-center'>
                  <i className='fas fa-bell fa-fw'></i>
                  <span className='badge badge-danger counter'>3+</span>
                </div>
                <Dropdown.Menu className='dropdown-menu-right dropdown-list'>
                  <Dropdown.Header>Bandeja de notificaciones</Dropdown.Header>
                  <Dropdown.Item className='d-flex align-items-center'>
                    <div className='mr-3'>
                      <div className='icon-circle bg-primary'>
                        <i className='fas fa-file-alt text-white'></i>
                      </div>
                    </div>
                    <div>
                      <div className='small text-gray-500'>
                        Diciembre 12, 2019
                      </div>
                      <span className='font-weight-bold'>
                        Un nuevo proyecto ha sido creado
                      </span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className='d-flex align-items-center'>
                    <div className='mr-3'>
                      <div className='icon-circle bg-success'>
                        <i className='fas fa-donate text-white'></i>
                      </div>
                    </div>
                    <div>
                      <div className='small text-gray-500'>
                        Diciembre 7, 2019
                      </div>
                      $290.000 COP han sido invertidos en el proyecto Tesis HCI
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className='d-flex align-items-center'>
                    <div className='mr-3'>
                      <div className='icon-circle bg-warning'>
                        <i className='fas fa-exclamation-triangle text-white'></i>
                      </div>
                    </div>
                    <div>
                      <div className='small text-gray-500'>
                        Diciembre 2, 2019
                      </div>
                      En la ultima hora alguien intento acceder a su cuenta
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className='text-center small text-gray-500'>
                    Ver todas las notificaciones
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Toggle>
            </Dropdown>
          </li>
          <div className='topbar-divider d-none d-sm-block'></div>
          <li className='dropdown no-arrow'>
              <div className="nav-link dropdown-toggle">
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{this.email}</span>
              </div>
            <DropdownButton className='doctor' alignRight title='' id='profile'>
              <Dropdown.Item as='button'>
                <i className='fas fa-user fa-sm fa-fw mr-2 text-gray-400'></i>
                Profile
              </Dropdown.Item>
              <Dropdown.Item as='button'>
                <i className='fas fa-list fa-sm fa-fw mr-2 text-gray-400'></i>
                Activity Log
              </Dropdown.Item>
              <Dropdown.Item onClick={this.onLogout}>
                <i className='fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400'></i>
                Logout
              </Dropdown.Item>
            </DropdownButton>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar;
