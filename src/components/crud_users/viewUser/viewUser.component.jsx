import React, { Component } from 'react';
import axios from 'axios';

import { ListGroup } from 'react-bootstrap';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import Capitalize from 'react-capitalize';
import Loader from 'react-loader-spinner';

/**
 * @author Dardila
 * @description Este se componente se encarga de mostrar los datos del usuario.
 */
class ViewUserFormik extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userInfo: [],
      userPermissions: [],
      isAdmin: true
    };
  }

  isPermissionsCenters = () => {
    if (this.state.userPermissions.length > 1) {
      return this.state.userPermissions.filter(e =>
        e.user_permissions__codename.includes('_center')
      ).length === 3
        ? 'centros'
        : '';
    }
    return '';
  };

  isPermissionsUsers = () => {
    if (this.state.userPermissions.length > 1) {
      return this.state.userPermissions.filter(e =>
        e.user_permissions__codename.includes('_user')
      ).length === 3
        ? 'usuarios'
        : '';
    }
    return '';
  };

  isVisiblePermissions = () => {
    if (
      this.isPermissionsCenters() !== '' ||
      this.isPermissionsUsers() !== ''
    ) {
      return true;
    }
    return false;
  };

  /**
   * @function getUserByEmail
   * @description obtiene la informacion del usuario por medio de su email.
   */
  getUserByEmail = email => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/users/' + email,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({
            userInfo: response.data,
            loading: false
          });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  /**
   * @function getUserPermissions
   * @description Obtiene todos los permisos de un usuario por su email
   * @param email
   */
  getUserPermissions = email => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .get(
          URL + '/users/permissions/all/' + email,
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(response => {
          this.setState({ userPermissions: response.data, loading: false });
        })
        .catch(() => this.setState({ loading: false }))
    );
  };

  componentDidMount() {
    this.getUserPermissions(this.props.email);
    this.getUserByEmail(this.props.email);
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    return (
      <section>
        {this.state.loading ? (
          <Loader
            type='ThreeDots'
            height={100}
            width={100}
            color='#00BFFF'
            timeout={3000}
            className='mh'
          />
        ) : this.state.userInfo.length > 0 ? (
          <ListGroup>
            <ListGroup.Item variant='dark'>
              <h5 className='mb-0'>
                {this.state.userInfo[0].is_staff ? 'Administrador' : 'Simple'}
              </h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <Capitalize>{this.state.userInfo[0].first_name}</Capitalize>{' '}
              <Capitalize>{this.state.userInfo[0].last_name}</Capitalize>
            </ListGroup.Item>
            <ListGroup.Item>{this.state.userInfo[0].email}</ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Centro médico: </b>
                <Capitalize>
                  {this.state.userInfo[0].my_center__name}
                </Capitalize>
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span>
                <b>Departamento: </b>
                <Capitalize>
                  {this.state.userInfo[0].my_department__name}
                </Capitalize>
              </span>
            </ListGroup.Item>
            <ListGroup.Item
              className={
                this.state.isAdmin && this.isVisiblePermissions()
                  ? ''
                  : 'hidden'
              }>
              <span>
                <b>Permisos sobre: </b>
                {this.isPermissionsCenters()} {this.isPermissionsUsers()}
              </span>
            </ListGroup.Item>
          </ListGroup>
        ) : (
          <h4>El usuario no existe</h4>
        )}
      </section>
    );
  }
}

export default ViewUserFormik;
