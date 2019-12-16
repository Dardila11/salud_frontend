import axios from 'axios';
import { URL } from './URLSever';
import { closeSession } from './handleLocalStorage';

export function vertificationToken(source) {
  const token = JSON.parse(localStorage.getItem('token'));
  const data = {
    token: token
  };
  if (token !== null) {
    const request = axios
      .post(URL + '/users/token/verificate/', data, {}, { cancelToken: source })
      .then((response) => {
        refreshToken(source);
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error);
      });
    return request;
  }
}

function refreshToken(source) {
  const token = JSON.parse(localStorage.getItem('token'));
  const data = {
    token: token
  };
  axios
    .post(URL + '/users/token/refresh/', data, {}, { cancelToken: source })
    .then(response => {
      localStorage.setItem('token', JSON.stringify(response.data.token));
    })
    .catch(error => {
      const status = JSON.parse(error.request.status);
      if (status === 400) {
        closeSession();
        alert('La sesion ha expirado.');
      }
    });
}
