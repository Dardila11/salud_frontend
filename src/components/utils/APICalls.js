import { URL } from './URLSever';
import axios from 'axios';

export async function getCenters() {
  var infoCenters = [];

  const token = JSON.parse(localStorage.getItem('token'));
  await axios
    .get(URL + '/places/center/all/', {
      headers: {
        Authorization: 'JWT ' + token
      }
    })
    .then(response => {
      console.log('se obtiene respuesta');
      infoCenters.push(response.data);
      viewCentersInfo(infoCenters);
    });
}

function viewCentersInfo(infoCenters) {
  console.log('se corre viewCenterInfo');
  infoCenters.map(center => {
    console.log('En ViewCentersInfo: ' + center);
  });
  var optionsCentersArray = [];
  for (let index = 0; index < infoCenters.length; index++) {
    var name = infoCenters[index].fields.name;
    var pk = infoCenters[index].pk;
    console.log('nombre ' + name + ' pk ' + pk);
    optionsCentersArray.push({ myPk: pk, myName: name });
  }
  optionsCentersArray.map(center => {
    console.log(center);
  });
}
