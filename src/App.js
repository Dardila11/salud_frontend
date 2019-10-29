import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./components/auth/signIn/signIn.component";
import AdminDashboard from "./components/dashboard/administrator/admin.component";
import UserDashboard from "./components/dashboard/user/user.component";

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' component={SignIn} />
          <Route exact path='/admin' component={AdminDashboard} />
          <Route exact path='/user' component={UserDashboard} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
