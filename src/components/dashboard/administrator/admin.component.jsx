import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "./admin.styles.css";

// TODO:
// - Falta agregar sesión expirada por inactividad
class AdminDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  role = JSON.parse(localStorage.getItem("role"));
  constructor(props) {
    super(props);
    this.state = {
      isLogged: true,
      isNew: true
    };
  }
  vertification = () => {
    var token = JSON.parse(localStorage.getItem("token"));
    if (this.role !== null) {
      if (this.role === "is_staff") {
        axios
          .post(URL + "/users/verificate/administrator/", {
            headers: {
              "Content-Type":
                "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
              Authorization: "JWT " + token
            }
          })
          .then(response => {
            console.log("El servidor dice: " + response.status);
            this.setState({ isLogged: true });
          })
          .catch(error => {
            //closeSession();
            console.warn(JSON.parse(error.request.response));
            alert("Sesión expirado por inactividad");
            this.setState({ isLogged: false });
          });
      } else {
        closeSession();
        alert("Sesión expirada por politicas de seguridad");
        this.setState({ isLogged: false });
      }
    }
  };

  componentDidMount() {
    //this.vertification();
  }
  render() {
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
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
