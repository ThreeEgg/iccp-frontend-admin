export function getAuthorityToken() {
  return localStorage.getItem('accessToken');
}

export function setAuthorityToken(token) {
  return localStorage.setItem('accessToken', token);
}
