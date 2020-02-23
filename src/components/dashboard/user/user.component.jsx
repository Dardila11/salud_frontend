import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';

import { getHeader, showAlert } from '../../utils/utils';
import AlertComponent from '../../layout/alert/alert.component';

import React, { Component } from 'react';
import NavBar from '../../layout/navbar/navbar.component';
import { URL } from '../../utils/URLSever';
import { closeSession } from '../../utils/handleLocalStorage';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import NavUser from './navUser/navUser.component';
import Confirmation from '../../auth/confirmationData/confirmationData.component';
import ListProjectsUser from '../../crud_user/listProjectsUser/listProjectsUser.component'
// import { vertificationToken } from "../../utils/verificationToken";

class UserDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  role = JSON.parse(localStorage.getItem('role'));
  constructor(props) {
    super(props);
    this.state = {
      isLogged: true,
      isNew: true,
      userInfo: [],
      alertVariant: '',
      alertMessage: '',
      alertId: 'alert-listUsers',
      isVisibleConfirm: false
    };
  }

  vertification = () => {
    // vertificationToken();
    this.vertificationAuthorization();
  };

  vertificationAuthorization = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'JWT ' + token
    };
    axios
      .post(URL + '/users/verificate/simple/', {}, { headers: headers })
      .then(() => {
        this.setState({ isLogged: true });
      })
      .catch(error => {
        const status = JSON.parse(error.request.status);
        if (status === 401 || status === 500) {
          closeSession();
          this.setState({ isLogged: false });
        }
      });
  };
  getUserToConfirm = () => {
    var email = JSON.parse(localStorage.getItem('email'));
    const headers = getHeader();
    axios
      .get(
        URL + '/users/user/' + email + '/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
        console.log(response)
        this.setState({ userInfo: response.data }, () => {
          this.getUsersInfo();
        });
      });
  };
  onLogout = () => {
    const headers = getHeader();
    axios.delete(URL + '/users/logout/', { headers: headers }).then(() => {
      closeSession();
      this.setState({ isLogged: false });
    });
  };
  handleClose = () => {

    this.onLogout();
  };
  handleCloseConfirm = () => {
    //this.getMembers();
    this.setState({
      alertVariant: 'success',
      alertMessage: 'Datos Confirmados',
      isVisibleConfirm:false
    });
    showAlert(this.state.alertId);
  };
  getUsersInfo(){
    if(!this.state.userInfo[0].is_confirm)
    this.setState({
      isVisibleConfirm: true
      
    });

  }

  componentDidMount() {
    this.vertification();
    this.getUserToConfirm();
    //console.log(localStorage)
  }

  render() { 
    if (!this.state.isLogged) {
      return <Redirect to='/' />;
    }
    return (
     
      <section
        id='wrapper'
        className='h-100 container-fluid p-0'
        onMouseDown={() => this.vertification(false)}>
                    <NavUser />
        <div id='content-wrapper' className='d-flex flex-column'>
          <div id='content'>
          <NavBar /> 

            <div className='container pt-2 pr-5 pl-5 pb-2'>
              
              <ListProjectsUser
                  email={JSON.parse(localStorage.getItem('email'))}
              />
            </div>
          </div>
        </div>
        <Modal show={this.state.isVisibleConfirm} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <Confirmation
            infoDepartaments={1}
            infoCenters={1}
            handleCloseConfirm={this.handleCloseConfirm}
            handleClose={this.handleClose}
            email={this.state.emailToRead}
            userInfo={this.state.userInfo[0]}
            userPermissions={this.state.userPermissions}
          />
        </Modal>

        <AlertComponent
          alertId={this.state.alertId}
          alertVariant={this.state.alertVariant}
          alertMessage={this.state.alertMessage}
        />
      </section>
    );
  }
}

export default UserDashboard;
