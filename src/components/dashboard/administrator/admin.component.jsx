import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <section>
        <NavBar />
        <NavAdmin />
      </section>
    );
  }
}

export default AdminDashboard;
