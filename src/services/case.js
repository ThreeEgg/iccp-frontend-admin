import api from './api';
import request from './request';

export const caseChatList = async params =>
  request(api.getChatList, {
    params,
  });
