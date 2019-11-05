import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import { URL } from "../../utils/URLSever";
import { closeSession } from "../../utils/handleLocalStorage";
import axios from "axios";
import { Redirect } from "react-router-dom";
import NavUser from "./navUser/navUser.component";
import { vertificationToken } from "../../utils/verificationToken";

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
    this.vertificationAuthorization();
    vertificationToken();
  };

  vertificationAuthorization = () => {
    const token = localStorage.getItem("token").replace(/[""]+/g, "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "JWT " + token
    };
    axios
      .post(URL + "/users/verificate/simple/", {}, { headers: headers })
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
      <section>
        <NavBar />
        <NavUser />
      </section>
    );
  }
}

export default UserDashboard;
