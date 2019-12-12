import React, { Component } from 'react';

import ListUsers from '../../../crud_users/listUsers/listUsers.component';
import NavBar from '../../../layout/navbar/navbar.component';
import NavBarTop from '../navAdmin/navbarTop.component';

class NavAdminStudies extends Component {
  render() {
    return (
      <section id='wrapper'>
        <NavBarTop />
        <div id='content-wrapper' className='d-flex flex-column'>
          <div id='content'>
            <NavBar />
            <div className='container pt-2 pr-5 pl-5 pb-2'>
              <ListUsers />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default NavAdminStudies;
