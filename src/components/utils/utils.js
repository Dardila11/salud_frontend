import $ from 'jquery';

export async function showAlert(alertId) {
  $('#' + alertId).hide();
  window.clearTimeout(alert);
  $('#' + alertId).show();
  $('#' + alertId).removeClass('back');
  var alert = window.setTimeout(function() {
    $('#' + alertId).slideDown(function() {
      $('#' + alertId).hide();
      $('#' + alertId).addClass('back');
    });
  }, 2000);
}

export default function ValidateEmail(mail) {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return true;
  else return false;
}

export function toCapitalizer(string) {
  var stringCapitalizer = '';
  const stringVector = string.split(' ');
  var i = 0;
  stringVector.forEach(e => {
    if (i === stringVector.length - 1) {
      stringCapitalizer += e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
    } else {
      stringCapitalizer +=
        e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() + ' ';
    }
    i++;
  });
  return stringCapitalizer;
}

export function getHeader() {
  const token = JSON.parse(localStorage.getItem('token'));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'JWT ' + token
  };
  return headers;
}

export function translate(e) {
  if (JSON.parse(e.request.response).email !== undefined) {
    return 'Ya existe un usuario con igual correo';
  }
}

export function genId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getDateFormat(date) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + 5);  
  const day =
    newDate.getDate() < 10 ? '0' + newDate.getDate() : '' + newDate.getDate();
  const month =
    newDate.getMonth() < 9
      ? '0' + (newDate.getMonth() + 1)
      : '' + (newDate.getMonth() + 1);
  const year = newDate.getFullYear() + '';
  return year + '-' + month + '-' + day;
}
