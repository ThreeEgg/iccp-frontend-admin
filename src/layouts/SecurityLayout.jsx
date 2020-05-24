import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { getAuthorityToken } from '@/common/authority';
import { inject } from 'iccp-frontend-im/dist';
import global from '@/global';
import * as commonService from '@/services/common';
import * as imService from '@/services/im';

// 启动im模块
inject({
  service: {
    common: commonService,
    im: imService,
  },
  global,
  storageApi: {
    set:
      typeof window !== 'undefined'
        ? window.localStorage.setItem.bind(window.localStorage)
        : () => { },
    get:
      typeof window !== 'undefined'
        ? window.localStorage.getItem.bind(window.localStorage)
        : () => '',
  },
});
class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    // 提供dispatch注入
    if (!global.dispatch) {
      global.dispatch = this.props.dispatch;
    }
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    if (this.props.initAuthority) {
      return;
    }

    // 判断本地登录态
    if (getAuthorityToken()) {
      // 同步取出本地的用户、im信息
      this.props.dispatch({
        type: 'user/save',
        payload: {
          userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {},
          imInfo: localStorage.imInfo ? JSON.parse(localStorage.imInfo) : {},
          isLogin: localStorage.isLogin > 0,
        },
      })
      // 提交sdk连接请求
      if (!this.props.imIsLogin) {
        this.props.dispatch({ type: 'im/connect' });
      }
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, isLogin } = this.props;

    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading, im, }) => ({
  isLogin: user.isLogin,
  imIsLogin: im.isLogin,
  loading: loading.models.user,
}))(SecurityLayout);
