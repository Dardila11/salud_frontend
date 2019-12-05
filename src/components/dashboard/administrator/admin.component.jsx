import React, { Component } from "react";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";
import { URL } from "../../utils/URLSever";
import axios from "axios";
import { vertificationToken } from "../../utils/verificationToken";
import { Redirect } from "react-router-dom";
import "../../../css/sb-admin-2.min.css";
import "../../../vendor/fontawesome-free/css/all.min.css";
import "./admin.styles.css";
import { closeSession } from "../../utils/handleLocalStorage";

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
        if (status === 401 || status === 500) {
          closeSession();
          this.setState({ isLogged: false });
        }
      });
  };

  componentDidMount() {
    this.vertification();
  }

  render() {
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <section
        id="wrapper"
        className="h-100 container-fluid p-0"
        onMouseDown={this.vertification}
      >
        <NavAdmin></NavAdmin>
      </section>
    );
  }
}

export default AdminDashboard;
