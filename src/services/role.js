import api from './api';
import request from './request';

export const getRoleInfo = async ({pageNum,pageSize,createTimeBegin,createTimeEnd,createUserName,description,roleType,
  updateTimeBegin,updateTimeEnd,updateUserName}) =>{
  return request(api.roleList, {
    params: {
      pageNum,pageSize,createTimeBegin,createTimeEnd,createUserName,description,roleType,
      updateTimeBegin,updateTimeEnd,updateUserName
    }
  })
}