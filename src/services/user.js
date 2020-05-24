import api from './api';
import request from './request';

export const registry = async ({ email, password }) => {
  return request.post(api.registry, {
    params: {
      email,
      password,
    },
  });
};

export const getRegistryAgreement = async () => {
  return request(api.getRegistryAgreement);
};

export const login = async ({ password, platform, userName }) => {
  return request(api.login, {
    params: {
      password,
      platform, // user-用户端 expert-专家端 admin-管理端
      userName,
    },
  });
};

export const logout = async () => {
  return request(api.logout);
};

export const getUserInfo = async () => {
  return request(api.getUserInfo);
};

export const modifyPassword = async ({ newPassword, oldPassword }) => {
  return request.post(api.modifyPassword, {
    params: {
      newPassword,
      oldPassword,
    },
  });
};

export const modifyUserName = async ({ name, userId }) => {
  return request.post(api.modifyUserName, {
    params: {
      name,
      userId,
    },
  });
};

export const resetPassword = async ({ newPassword, verifyCode }) => {
  return request(api.resetPassword, {
    params: {
      newPassword,
      verifyCode,
    },
  });
};

export const requestEmailForResetPassword = async ({ email }) => {
  return request(api.requestEmailForResetPassword, {
    params: {
      email,
    },
  });
};
