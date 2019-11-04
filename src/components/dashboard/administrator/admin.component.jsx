import React, { Component } from "react";
import NavBar from "../../layout/navbar/navbar.component";
import NavAdmin from "../administrator/navAdmin/navAdmin.component";
import { URL } from "../../utils/URLSever";
import axios from "axios";

class AdminDashboard extends Component {
  CancelToken = axios.CancelToken;
  source = this.CancelToken.source();

  role = localStorage.getItem("role").replace(/[""]+/g, "");
  constructor(props) {
    super(props);
    this.state = {
      isLogged: true,
      isNew: true
    };
  }
  vertification = () => {
    var token = localStorage.getItem("token").replace(/[""]+/g, "");
    const headers = {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      Authorization: "JWT " + token
    };
    if (this.role !== null) {
      if (this.role === "is_staff") {
        axios.post(
          URL + "/users/verificate/administrator/",
          {
            headers: headers
          },
          { cancelToken: this.source.token }
        );
      }
      // TODO: TERMINAR ESTO
    }
  };
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
