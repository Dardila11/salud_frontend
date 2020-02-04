import React, { Component } from 'react';
import axios from 'axios';

import Loader from 'react-loader-spinner';
import { Redirect } from 'react-router-dom';

import { closeSession } from '../../utils/handleLocalStorage';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import { vertificationToken } from '../../utils/verificationToken';
import NavBar from '../../layout/navbar/navbar.component';
import NavBarLateral from './navAdmin/navbarLateral.component';
import NavBarLateralProject from './navAdmin/navbarLateralProject.component';
import ListProjects from '../../crud_projects/listProjects/listProjects.component';
import ListUsers from '../../crud_users/listUsers/listUsers.component';
import ViewUserFormik from '../../crud_users/viewUser/viewUser.component';
import ViewProject from '../../crud_projects/viewProject/viewProject.component';
import ListMembers from '../../crud_members/listMembers/listMembers.component';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './admin.styles.css';
import '../../../css/sb-admin-2.min.css';
import '../../../vendor/fontawesome-free/css/all.min.css';

class AdminDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isAuthenticated: true,
      projectBar:false
    };
  }

  vertification = reloaded => {
    vertificationToken(this.source.token)
      .then(() => {
        this.vertificationAuthorization(reloaded);
      })
      .catch(error => {
        const status = JSON.parse(error.request.status);
        if (status === 400) {
          closeSession();
          alert('La sesion ha expirado.');
          this.setState({ isAuthenticated: false });
        }
      });
  };

  vertificationAuthorization = reloaded => {
    const headers = getHeader();
    
    reloaded
      ? this.setState({ loading: true }, () =>
          axios
            .post(
              URL + '/users/verificate/administrator/',
              {},
              { headers: headers },
              { cancelToken: this.source.token }
            )
            .then(() => {
              this.setState({ isAuthenticated: true }, () => {
                this.setState({ loading: false });
              });
            })
            .catch(error => {
              const status = JSON.parse(error.request.status);
              if (status === 401 || status === 500) {
                closeSession();
                this.setState({ isAuthenticated: false, loading: false });
              }
            })
        )
      : axios
          .post(
            URL + '/users/verificate/administrator/',
            {},
            { headers: headers },
            { cancelToken: this.source.token }
          )
          .then(() => {
            this.setState({ isAuthenticated: true });
          })
          .catch(error => {
            const status = JSON.parse(error.request.status);
            if (status === 401 || status === 500) {
              closeSession();
              this.setState({ isAuthenticated: false });
            }
          });
  };

  /**
   * @function contectAdmin()
   * @description Segun sea el path de la URL decide cual vista mostrar
   */
  contentAdmin = () => {
    
    const path = this.props.match.path;
    if (path.endsWith('/users') || path.endsWith('/users/')) {
      return <ListUsers />;
    } else if (path.endsWith('/studies') || path.endsWith('/users/')) {
      return <ListProjects />;
    } else if (path.startsWith('/admin/users/')) {
      return <ViewUserFormik email={this.props.match.params.user} />;
    } else if (path.startsWith('/admin/studies/members/')) {
      
      return <ListMembers project={this.props.match.params.study} />;
    } 
    else if (path.startsWith('/admin/studies/')) {
      return <ViewProject project={this.props.match.params.study} />;
    }
 

  };

  componentDidMount() {
    this.vertification(true);
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  render() {
    var bar
    const path = this.props.match.path;
    if (path.startsWith('/admin/studies/members/'))
      bar=<NavBarLateralProject />
    else      
      bar= <NavBarLateral />
    
    if (!this.state.isAuthenticated) {
      return <Redirect to='/' />;
    }
    if (this.state.loading) {
      return (
        <Loader
          type='ThreeDots'
          color='#00BFFF'
          height={100}
          width={100}
          className='mh'
        />
      );
    }
    
      return (
        <section
          id='wrapper'
          className='h-100 container-fluid p-0'
          onMouseDown={() => this.vertification(false)}>
          {bar}
          <div id='content-wrapper' className='d-flex flex-column'>
            <div id='content'>
              <NavBar />
              <div className='container pt-2 pr-5 pl-5 pb-2'>
                <this.contentAdmin />
              </div>
            </div>
          </div>
        </section>
      );
  }
}

export default AdminDashboard;
