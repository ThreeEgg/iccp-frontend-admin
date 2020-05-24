import config from '../config';

export default {
  baseUrl: config.baseUrl,
  // 用户管理
  registry: '/user/registry',
  getRegistryAgreement: '/user/registry-agreement',
  login: '/user/login',
  logout: '/user/logout',
  getUserInfo: '/user/userinfo',
  modifyPassword: '/user/password/update',
  modifyUserName: '/user/name/update',
  resetPassword: '/user/reset-passwd',
  requestEmailForResetPassword: '/user/request-passwd-reset',

  // 聊天管理
  requestIMId: '/im/request-imid',
  checkFirstChat: '/im/check-welcome',
  checkFirstChatForCustomerService: '/im/check-welcome-service',
  recentChatList: '/im/recent-chat',
  receiveMsg: '/im/receiveMsg',
  getCaseInfo: '/case/get',
  saveCaseInfo: '/case/update',
  saveOrder: '/order/create',
  historyChatMsg: '/im/chat-history',
  chatRecord: '/im/chat-history-vedio',
  getTranslate: '/support/translate',
  downloadCaseBatch: '/support/downloadBatch',

  // 其他
  getServiceList: '/service/list',
  fileUpload: '/support/upload',
  getContinentList: '/system/continent/list',
  getCountryList: '/system/country/list',

  // 后台管理
  // 平台内容管理
  platformGet: '/platform/get',
  platformDelete: '/platform/delete',
  platformList: '/platform/list',
  platformUpdate: '/platform/update',

  // 专家
  expertGetList: '/system/expert/list',
  expertCreate: '/system/expert/create',
  expertBatchImport: '/system/expert/import',
  expertBatchImportImage: '/system/expert/image/import',
  expertNotify: '/system/expert/notify-schedule',
  expertResetPassword: '/system/expert/reset-passwd',
  expertUpdateStatus: '/system/expert/status',

  // 用户
  userList: '/system/user/list',
  userResetPassword: '/system/user/reset-passwd',
  userUpdateStatus: '/system/user/status',

  // 地区
  continentList: '/system/continent/list',
  countryList: '/system/country/list',

  // 角色
  roleGet: '/system/role/get',
  roleDelete: '/system/role/delete',
  roleList: '/system/role/list',
  roleUpdate: '/system/role/update',

  // 案件
  caseChangeCustomerService: '/system/change-customersrv',
  // 客服与其他角色聊天列表
  caseChatList: '/system/chatlist/list',
  // 其他角色之间的聊天列表
  caseUserChatList: '/system/chatlist-user-expert/list',
  caseCustomerServiceList: '/system/customersrv/list',
  caseNotifyList: '/system/order/list',

  // 系统管理 账号管理
  accountList: '/system/account/list',
  
  // 系统管理 数据统计
  staticsInfo: '/system/statics'
};
