import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AdminDashboard from './components/dashboard/administrator/admin.component';
import PageNotFound from './components/pages/pageNotFound.component';
import Recovery from './components/auth/recovery/recovery.component';
import SignIn from './components/auth/signIn/signIn.component';
import UserDashboard from './components/dashboard/user/user.component';

import './App.css';

function App() {
  return (
    <>
      <Router>
        <p>Si imprimo</p>
        <div className='App'>
          <Switch>
            <Route exact path='/' component={SignIn} />
            <Route exact path='/admin/users' component={AdminDashboard} />
            <Route exact path='/admin/studies' component={AdminDashboard} />
            <Route path='/admin/users/:user' component={AdminDashboard} />
            <Route path='/admin/studies/:study' component={AdminDashboard} />
            <Route path='/user' component={UserDashboard} />
            <Route path='/user/forget/:em' component={SignIn} />
            <Route path='/user/recovery/:tk' component={Recovery} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
