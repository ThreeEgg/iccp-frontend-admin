import React from 'react';
import { connect } from 'dva';
import Chat from '@/components/IM/Chat';
import Session from '@/components/IM/Session';
import Login from '@/components/IM/Login';
import { Layout, Button } from 'antd';
import './index.less';

const { Sider } = Layout;

class Index extends React.Component {
  state = {
  };

  // 进入该页面，文档被挂载
  async componentDidMount() {
    if (!global.dispatch) {
      global.dispatch = this.props.dispatch;
    }
    // 提交sdk连接请求
    if (!this.props.isLogin) {
      this.props.dispatch({ type: 'im/connect' });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    // this.props.dispatch({ type: 'im/updateRefreshState' })
  }

  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
  }

  // computed

  // methods
  render() {
    const { currSessionId } = this.props;
    return (
      <Layout style={{ height: '100%' }} className='nim'>
        <Sider
          theme='light'
          width='280'
          style={{
            overflow: 'auto',
            height: '100%',
          }}
        >
          <Session />
          {/* <Login /> */}
        </Sider>
        {currSessionId && <Chat />}
      </Layout>
    );
  }
}

export default connect(({ im }) => ({
  isLogin: im.isLogin,
  currSessionId: im.currSessionId,
}))(Index);
