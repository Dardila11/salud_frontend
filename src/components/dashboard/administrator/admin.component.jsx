import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <section>
        <NavBar />
        <div>Admin Dashboard</div>
      </section>
    );
  }
}

export default AdminDashboard;
