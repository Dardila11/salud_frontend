import React, { Component } from 'react';

import { Button, Modal, ListGroup } from 'react-bootstrap';
import Capitalize from 'react-capitalize';

/**
 * @author Dardila
 * @description Este se componente se encarga de mostrar los datos del usuario.
 */
class ViewUserFormik extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: this.props.userInfo[0].is_staff ? true : false
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  isPermissionsCenters = () => {
    if (this.props.userPermissions.length > 1) {
      return this.props.userPermissions.filter(e =>
        e.user_permissions__codename.includes('_center')
      ).length === 3
        ? 'centros'
        : '';
    }
    return '';
  };

  isPermissionsUsers = () => {
    if (this.props.userPermissions.length > 1) {
      return this.props.userPermissions.filter(e =>
        e.user_permissions__codename.includes('_user')
      ).length === 3
        ? 'usuarios'
        : '';
    }
    return '';
  };

  isVisiblePermissions = () => {
    if (this.isPermissionsCenters() !== '' || this.isPermissionsUsers() !== '') {
      return true;
    }
    return false;
  }

  render() {
    return (
      <section>
        <Modal.Header closeButton>
          <Modal.Title className='h3 text-gray-800 mb-0'>
            Detalles usuario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item variant='dark'>
              <h5 className='mb-0'>
                {this.props.userInfo[0].is_staff ? 'Administrador' : 'Simple'}
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <Capitalize>{this.props.userInfo[0].first_name}</Capitalize>{' '}
              <Capitalize>{this.props.userInfo[0].last_name}</Capitalize>
            </ListGroup.Item>
            <ListGroup.Item>{this.props.userInfo[0].email}</ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Centro médico: </b>
                <Capitalize>
                  {this.props.userInfo[0].my_center__name}
                </Capitalize>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Departamento: </b>
                <Capitalize>
                  {this.props.userInfo[0].my_department__name}
                </Capitalize>
              </span>
            </ListGroup.Item>
            <ListGroup.Item className={this.state.isAdmin && this.isVisiblePermissions() ? '' : 'hidden'}>
              <span>
                <b>Permisos sobre: </b>
                {this.isPermissionsCenters()} {this.isPermissionsUsers()}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </section>
    );
  }
}

export default ViewUserFormik;
