export function closeSession() {
  localStorage.removeItem('id');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}
