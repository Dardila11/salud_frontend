import axios from "axios";
import { URL } from "./URLSever";
import { closeSession } from "./handleLocalStorage";

export function vertificationToken() {
  const token = JSON.parse(localStorage.getItem("token"));
  const data = {
    token: token
  };
  if (token !== null) {
    axios
      .post(URL + "/users/token/verificate/", data)
      .then(() => {
        refreshToken();
      })
      .catch(error => {
        const status = JSON.parse(error.request.status);
        if (status === 400) {
          closeSession();
          alert("La sesion ha expirado.");
        }
      });
  }
}

function refreshToken() {
  const token = JSON.parse(localStorage.getItem("token"));
  const data = {
    token: token
  };
  axios.post(URL + "/users/token/refresh/", data).then(response => {
    localStorage.setItem("token", JSON.stringify(response.data.token));
  });
}
