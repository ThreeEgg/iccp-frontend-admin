import api from './api';
import request from './request';

export const expertGetList = async ({
  countryCode,
  createDateFrom,
  createDateTo,
  email,
  isRecentScheduled,
  isValid,
  name,
  pageNum = 1,
  pageSize = 10,
  userId,
}) =>
  request(api.expertGetList, {
    params: {
      countryCode,
      createDateFrom,
      createDateTo,
      email,
      isRecentScheduled,
      isValid,
      name,
      pageNum,
      pageSize,
      userId,
    },
  });

export const expertNotify = async ({ userId }) => request(api.expertNotify, { params: { userId } });

export const expertResetPassword = async ({ userId }) =>
  request(api.expertResetPassword, { params: { userId } });

export const expertUpdateStatus = async ({ userId, isValid }) =>
  request(api.expertUpdateStatus, { params: { userId, isValid } });

export const getCountryList = async ({ id }) =>
  request(api.getCountryList, {
    params: { id },
  });

export const getExpertList = async ({ countryCode, serviceTagIdList = [] }) =>
  request(api.getExpertList, {
    params: {
      countryCode,
      serviceTagIdList,
    },
  });

export const getExpertIndividualIntroduce = async ({ userId }) =>
  request(api.getExpertIndividualIntroduce, {
    params: {
      userId,
    },
  });

export const saveExpertIndividualIntroduce = async ({ introduction }) =>
  request.post(api.saveExpertIndividualIntroduce, {
    data: introduction,
  });

export const getExpertActivityList = async ({ pageNum, pageSize, userId }) =>
  request(api.getExpertActivityList, {
    params: {
      pageNum,
      pageSize,
      userId,
    },
  });

export const getExpertActivityById = async ({ articleId }) =>
  request(api.getExpertActivityById, {
    params: {
      articleId,
    },
  });

export const saveExpertActivity = async ({ activity }) =>
  request.post(api.saveExpertActivity, {
    data: activity,
  });

export const deleteExpertActivity = async ({ id }) =>
  request(api.deleteExpertActivity, {
    params: {
      id,
    },
  });

export const getExpertArticleById = async ({ id }) =>
  request(api.getExpertArticleById, {
    params: {
      id,
    },
  });

export const saveExpertArticle = async ({ article, brief, title, id }) =>
  request.post(api.saveExpertArticle, {
    data: {
      article,
      brief,
      title,
      id,
    },
  });

export const deleteExpertArticle = async ({ id }) =>
  request(api.deleteExpertArticle, {
    params: {
      id,
    },
  });

export const getAllServiceTagList = async ({ userId }) =>
  request(api.getAllServiceTagList, {
    params: {
      userId,
    },
  });

export const saveServiceTagList = async ({ serviceIdStr }) =>
  request.post(api.saveServiceTagList, {
    params: {
      serviceIdStr,
    },
  });

export const getExpertInformation = async ({ userId }) =>
  request(api.getExpertInformation, {
    params: {
      userId,
    },
  });

export const saveExpertInformation = async ({ content }) =>
  request.post(api.saveExpertInformation, {
    data: content,
  });

export const getExpertScheduleByGreenwich = async ({ timeZone, userId }) =>
  request(api.getExpertScheduleByGreenwich, {
    params: {
      timeZone,
      userId,
    },
  });

export const saveExpertSchedule = async ({ schedule, startTime, timeZone, userId }) =>
  request.post(api.saveExpertSchedule, {
    data: {
      // 日程表字符串
      schedule,
      userId,
      timeZone,
      // 开始时间，单位为秒
      startTime,
    },
  });
