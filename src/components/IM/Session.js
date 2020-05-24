import React from 'react';
import { connect } from 'dva';
import { Menu } from 'antd';

const config = {
  // 默认客服头像
  defaultServiceIcon: '/im/ic_im_service.svg',
  // 默认用户头像
  defaultUserIcon: '/im/ic_im_default.svg',
  // 默认本人头像
  defaultMeIcon: '/im/ic_im_me.svg',
  // 默认他人头像
  defaultClientIcon: '/im/ic_im_client.svg',
}

class Session extends React.Component {
  state = {
    delSessionId: null,
    stopBubble: false,
    isExpert: false,
  };

  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.isExpert();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.myInfo !== this.props.myInfo) {
      this.isExpert();
    }
  }

  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    // this.props.dispatch({ type: 'im/resetCurrSession' });
  }

  // computed
  isExpert = () => {
    if (this.props.myInfo.type === 'expert') {
      this.setState({
        isExpert: true,
      });
    }
  };
  // sysMsgUnread = () => {
  //   let temp = this.props.sysMsgUnread;
  //   let sysMsgUnread = temp.addFriend || 0;
  //   sysMsgUnread += temp.team || 0;
  //   let customSysMsgUnread = this.props.customSysMsgUnread;
  //   return sysMsgUnread + customSysMsgUnread;
  // };

  // methods
  enterChat = ({ item, key, keyPath, domEvent }) => {
    // 此时设置当前会话
    const session = this.props.sessionlist[key]
    if (session && session.id && session.id !== this.props.currSessionId) {
      // 重置当前会话
      this.props.dispatch({ type: 'im/resetCurrSession' });
      // 此时设置当前会话
      this.props.dispatch({
        type: 'im/setCurrSession',
        sessionId: session.id,
      });
    }
  };

  enterMyChat = () => {
    // 我的手机页面
    this.props.dispatch({ type: 'im/setCurrSession', sessionId: `p2p-${this.myPhoneId}` });
  };

  initSession = () => {
    // 发起会话
    this.props.dispatch({ type: 'im/initSession', expertAccid: `4633e46abbef4c83bae2a3ab2713d7de` });
  };

  render() {
    const { im } = this.props;
    const { sessionlist } = im;
    return (
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['-1']}
      >
        {sessionlist && sessionlist.map((session, index) => (
          session.show &&
          <Menu.Item key={index} onClick={this.enterChat} className='nav-item' data-session={session.id}>
            <img className='nav-avatar' src={session.avatar || (session.isService ? config.defaultServiceIcon : config.defaultUserIcon)} />
            <span className='nav-info' >
              <span className='nav-name' >
                {session.name}
              </span>
              <span className='nav-time' >
                {session.updateTimeShow}
              </span>
              <span className='nav-text' >
                {session.lastMsgShow}
              </span>
              {session.unread > 0 &&
                <span className='nav-unread' >
                  {session.unread}
                </span>
              }
            </span>
          </Menu.Item>
        ))}
        {/* <Menu.Item onClick={this.initSession} className='nav-item'>
          <span className='nav-info' >
            <span className='nav-name'>
              发起新会话
                </span>
          </span>
        </Menu.Item> */}
      </Menu>
    );
  }
}

// export default Chat;
export default connect(({ im, user }) => ({
  im,
  currSessionId: im.currSessionId,
  userUID: im.userUID,
  sessionlist: im.sessionlist,
  myInfo: user.userInfo,
  userInfos: im.userInfos,
  robotInfos: im.robotInfos,
  customSysMsgUnread: im.customSysMsgUnread,
  sysMsgUnread: im.sysMsgUnread,
}))(Session);
