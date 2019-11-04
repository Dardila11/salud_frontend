import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavUser from "./navUser.component";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";
import axios from "axios";
import { Redirect } from "react-router-dom";

class UserDashboard extends Component {
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
    const headers = {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      Authorization: "JWT " + token
    };
    if (this.role !== null) {
      if (this.role === "is_simple") {
        axios
          .post(URL + "/users/verificate/simple/", {
            headers: headers
          })
          .then(response => {
            console.log("El servidor dice: " + response.status);
            this.setState({ isLogged: true });
          })
          .catch(() => {
            closeSession();
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
    // this.vertification();
  }
  render() {
    if (!this.state.isLogged) {
      return <Redirect to="/" />;
    }
    return (
      <section>
        <NavBar />
        <NavUser />
      </section>
    );
  }
}

export default UserDashboard;
