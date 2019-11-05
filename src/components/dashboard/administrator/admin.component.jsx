import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";
import axios from "axios";
import { vertificationToken } from "../../utils/verificationToken";
import { Redirect } from "react-router-dom";
import "./admin.styles.css";

// TODO:
// - Falta agregar sesión expirada por inactividad
class AdminDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      isLogged: true,
      isNew: true
    };
  }

  vertification = () => {
    vertificationToken();
    this.vertificationAuthorization();    
  };

  vertificationAuthorization = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .post(URL + "/users/verificate/administrator/", {}, { headers: headers })
      .then(() => {        
        this.setState({ isLogged: true });
      })
      .catch(error => {
        const status = JSON.parse(error.request.status);
        if (status === 401) {
          this.setState({ isLogged: false });
        }
      });
  };

  componentWillMount() {
    this.vertification();
  }

  render() {
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <section
        className="h-100 container-fluid p-0"
        onMouseDown={this.vertification}
      >
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
