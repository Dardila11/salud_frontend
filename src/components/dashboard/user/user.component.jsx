import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavUser from "./navUser.component";

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <section>
        <NavBar />
        <NavUser />
      </section>
    );
  }
}

export default UserDashboard;
