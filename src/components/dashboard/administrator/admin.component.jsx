import React, { Component } from 'react';
import axios from 'axios';

import Loader from 'react-loader-spinner';
import { Redirect } from 'react-router-dom';

import { closeSession } from '../../utils/handleLocalStorage';
import { getHeader } from '../../utils/utils';
import { URL } from '../../utils/URLSever';
import { vertificationToken } from '../../utils/verificationToken';
import NavAdminUsers from './contentAdmin/contentAdminUsers.component';
import NavAdminStudies from './contentAdmin/contentAdminStudies.component';

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
      isLogged: true,
      isNew: true
    };
  }

  vertification = () => {
    vertificationToken(this.source.token);
    this.vertificationAuthorization();
  };

  vertificationAuthorization = () => {
    const headers = getHeader();
    this.setState({ loading: true }, () =>
      axios
        .post(
          URL + '/users/verificate/administrator/',
          {},
          { headers: headers },
          { cancelToken: this.source.token }
        )
        .then(() => {
          this.setState({ isLogged: true }, () => {
            this.setState({ loading: false });
          });
        })
        .catch(error => {
          const status = JSON.parse(error.request.status);
          if (status === 401 || status === 500) {
            closeSession();
            this.setState({ isLogged: false });
          }
        })
    );
  };

  componentDidMount() {
    this.vertification();
  }

  componentWillUnmount() {
    this.source.cancel('cancel request');
  }

  contentAdmin = () => {
    if (this.props.match.path.split('/')[2] === 'users') {
      return <NavAdminUsers />;
    } else if ((this.props.match.path.split('/')[2] === 'studies')) {
      return <NavAdminStudies />
    }
  };

  render() {
    if (!this.state.isLogged) {
      return <Redirect to='/' />;
    }
    if (this.state.loading) {
      return (
        <Loader
          type='ThreeDots'
          height={100}
          width={100}
          color='#00BFFF'
          timeout={3000}
          className='mh'
        />
      );
    }
    return (
      <section
        className='h-100 container-fluid p-0'
        onMouseDown={vertificationToken(this.source.token)}
      >
        <this.contentAdmin />
      </section>
    );
  }
}

export default AdminDashboard;
