

import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';

import { getHeader, showAlert } from '../../utils/utils';
import AlertComponent from '../../layout/alert/alert.component';

import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";
import axios from "axios";
import { Redirect } from "react-router-dom";
import NavUser from "./navUser/navUser.component";
import Confirmation from "../../auth/confirmationData/confirmationData.component";
// import { vertificationToken } from "../../utils/verificationToken";

class UserDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();
  role = JSON.parse(localStorage.getItem("role"));
  constructor(props) {
    super(props);
    this.state = {
      isLogged: true,
      isNew: true,
      userInfo:[],
      isVisibleConfirm: false
    };
  }

  vertification = () => {
    // vertificationToken();
    this.vertificationAuthorization();
  };

  vertificationAuthorization = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .post(URL + "/users/verificate/simple/", {}, { headers: headers })
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
  getUserToConfirm = async () => {
    var email=JSON.parse(localStorage.getItem("email"));
    const headers = getHeader();
    await axios
      .get(
        URL + '/users/user/' + email + '/',
        { headers: headers },
        { cancelToken: this.source.token }
      )
      .then(response => {
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
    this.setState({
      isVisibleConfirm: false
      
    });
    this.onLogout()
  };
  getUsersInfo(){
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
    console.log(this.state.userInfo)
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <section onMouseDown={this.vertification}>
        <NavBar />
        <NavUser />
        <Modal show={this.state.isVisibleConfirm} onHide={this.handleClose}>
          {/* Actualizar Usuario */}
          <Confirmation
            infoDepartaments={1}
            infoCenters={1}
            handleCloseUpdate={this.handleCloseUpdate}
            handleClose={this.handleClose}
            email={'this.state.emailToRead'}
            userInfo={this.state.userInfo[0]}
            userPermissions={'this.state.userPermissions'}
          />
        </Modal>
      </section>
    );
  }
}

export default UserDashboard;
