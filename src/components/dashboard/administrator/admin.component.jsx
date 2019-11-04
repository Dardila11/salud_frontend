import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";
import "./admin.styles.css";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <section className="h-100 container-fluid p-0">
        <div className="navbar-custom">
          <NavBar />
        </div>
        <div className="navbody-custom">
          <NavAdmin />
        </div>
      </section>
    );
  }
}

export default AdminDashboard;
