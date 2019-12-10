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
export default function capitalizeFLetter(word) { 
  
  return word.charAt(0).toUpperCase() + 
   word.slice(1).toLowerCase(); 
} 

export function getHeader() {
  const token = JSON.parse(localStorage.getItem('token'));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'JWT ' + token
  };
  return headers;
}

export function getSerialize(e) {}

export function translate(e) {
  if (JSON.parse(e.request.response).email !== undefined) {
    return 'Ya existe un usuario con igual correo';
  }
}
