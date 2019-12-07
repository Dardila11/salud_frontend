import $ from 'jquery';

export async function showAlert() {
  $('.alert').hide();
  window.clearTimeout(alert);
  $('.alert').show();
  var alert = window.setTimeout(function() {
    $('.alert').slideDown(function() {
      $('.alert').hide();
    });
  }, 2000);
}
