import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <section>
        <NavBar />
        <div>User Dashboard</div>
      </section>
    );
  }
}

export default UserDashboard;
