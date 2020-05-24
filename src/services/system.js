import api from './api';
import request from './request';

export const caseChatList = async params =>
  request(api.getChatList, {
    params,
  });

export const getAccountList = async ({pageNum,pageSize,createTimeBegin,createTimeEnd,createUserName,name,
  updateTimeBegin,updateTimeEnd,updateUserName}) =>{
  return request(api.accountList, {
    params: {
      pageNum,pageSize,createTimeBegin,createTimeEnd,createUserName,name,
      updateTimeBegin,updateTimeEnd,updateUserName
    }
  })
}

export const getStaticsInfo = async params =>
  request(api.staticsInfo, {
    params,
  });