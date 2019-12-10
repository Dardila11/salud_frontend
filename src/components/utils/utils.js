import $ from 'jquery';

export async function showAlert(alertId) {
  $('#' + alertId).hide();
  window.clearTimeout(alert);
  $('#' + alertId).show();
  var alert = window.setTimeout(function() {
    console.log('haciendo');
    $('#' + alertId).slideDown(function() {
      $('#' + alertId).hide();
    });
  }, 2000);
}


export default function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  
    return (true)
  else
    
    return (false)
}

export function toCapitalizer(string) {
  var stringCapitalizer = '';
  const stringVector = string.split(' ');
  var i = 0;
  stringVector.forEach(e => {
    if (i === stringVector.length - 1) {
      stringCapitalizer +=
        e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
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
