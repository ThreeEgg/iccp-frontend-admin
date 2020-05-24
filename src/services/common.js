import api from './api';
import request from './request';

/**
 *
 * @param {*} file File类型
 */
export const fileUpload = async ({ clientUserId, expertUserId, file, fileName, type = 0 }) => {
  const form = new FormData();
  form.append('file', file, fileName);

  let userInfo = window.localStorage.getItem('userInfo');
  if (!userInfo) {
    throw new Error('userInfo not exist');
  }
  userInfo = JSON.parse(userInfo);
  const uploadUserId = userInfo.userId;

  return request.post(api.fileUpload, {
    params: {
      clientUserId,
      expertUserId,
      type,
      uploadUserId,
    },
    data: form,
  });
};

export const getServiceList = async () => request(api.getServiceList);

export const countryList = async () => request(api.countryList);

export const continentList = async () => request(api.continentList);
