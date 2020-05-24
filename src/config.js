/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-31 15:56:53
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-03 11:19:40
 * @FilePath: \PC端-前端\src\config.js
 */
const apiEnv = process.env.API_ENV;

let baseUrl = 'http://221.215.57.110:9821';

switch (apiEnv) {
  case 'test':
    baseUrl = 'http://172.16.1.161';
    break;
  case 'online':
    baseUrl = 'http://221.215.57.110:9821';
    break;
  case 'dev':
    baseUrl = 'http://221.215.57.110:9090';
    break;
  default:
}

export default {
  baseUrl,
  // baseUrl: 'http://221.215.57.110:9821', // 公网测试
  // baseUrl: 'http://172.16.1.161' // 内网测试
  // baseUrl: 'http://221.215.57.110:9090' // 公网开发
  // baseUrl: 'http://172.16.110.5:9090' // 内网开发
};
