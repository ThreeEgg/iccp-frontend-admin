export const getParameter = param => {
  const query = window.location.search;
  const iLen = param.length;
  let iStart = query.indexOf(param);
  if (iStart === -1) {
    return '';
  }
  iStart += iLen + 1;
  const iEnd = query.indexOf('&', iStart);
  if (iEnd === -1) {
    return query.substring(iStart);
  }
  return query.substring(iStart, iEnd);
};