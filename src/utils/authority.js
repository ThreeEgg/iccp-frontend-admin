import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('iccp-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  if (!authority) {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  const { userInfo, imInfo, accessToken, isLogin, platform, userId } = authority;
  localStorage.setItem('iccp-authority', JSON.stringify(['admin'])); // auto reload
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  localStorage.setItem('imInfo', JSON.stringify(imInfo));
  localStorage.setItem('isLogin', isLogin);
  localStorage.setItem('platform', platform);

  reloadAuthorized();
}

export function updateAuthority(data) {
  const { userInfo, imInfo, isLogin, userId } = data;
  localStorage.setItem('userId', userId);
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  localStorage.setItem('imInfo', JSON.stringify(imInfo));
  localStorage.setItem('isLogin', isLogin);
}
