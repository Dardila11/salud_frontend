export function closeSession() {
  localStorage.removeItem("email");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("role");
}
