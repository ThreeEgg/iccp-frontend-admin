/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';

export const getCommonHeader = () => {
  const header = {
    platform: 'pcweb',
    language: 'zh-CN',
    ua: window.navigator.userAgent,
    timezone: new Date().getTimezoneOffset() / 60,
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    header['x-auth-token'] = token;
  }
  return header;
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.message;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  prefix: '/api',
});

/**
 * request拦截
 * 1. header中加入token
 */
request.interceptors.request.use((url, options) => {
  let { headers } = options;

  headers = {
    ...options.headers,
    ...getCommonHeader(),
  };

  return {
    url,
    options: { ...options, headers },
  };
});

/**
 * response拦截
 * 1. 权限自动跳转
 * 2. 错误码提示
 */
request.interceptors.response.use(async (response, options) => {
  // 文件类型的请求且返回体是Blob直接返回，不处理请求体
  // if (options.responseType === 'blob' && data instanceof Blob) {
  //   return response;
  // }
  if (options.responseType === 'blob') {
    try {
      await response.clone().json();
    } catch (error) {
      return response;
    }
  }
  const data = await response.clone().json();
  if (!data) {
    return response;
  }
  // FIXME: 这里需要补全所有的错误情况
  if (data.code !== '0') {
    // 16000 token无效
    // 12000 需要人机验证
    if (data.code === '16000') {
      message.error('登录失效');
    } else if (data.code === '13000') {
      message.error('查无此案件');
    } else {
      notification.error({
        description: data.errorInfo,
        message: data.msg,
      });
    }
    return {};
  }
  return response;
});

export default request;
