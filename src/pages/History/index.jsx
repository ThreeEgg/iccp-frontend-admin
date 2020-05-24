import React from 'react';
import { connect } from 'dva';
import util from 'iccp-frontend-im/dist/utils';
import ChatList from '@/components/IM/ChatList';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';

class History extends React.Component {
  state = {
    scene: null,
    to: null,
    userInfo: {},
    otherIsExpert: false,
  };

  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.initSession()
    this.setMsgTranslateMap()
  }

  async componentDidUpdate(prevProps, prevState) {
    // 监听会话改变
    if (prevProps.currSessionId !== this.props.currSessionId) {
      this.initSession()
      this.setMsgTranslateMap()
    }
    // 监听会话对象改变
    if (prevProps.translateMap !== this.props.translateMap) {
      this.setMsgTranslateMap()
    }
  }

  // 离开该页面，此时重置当前会话
  async componentWillUnmount() {
    // this.props.dispatch({ type: 'im/resetCurrSession' });
  }

  // computed
  setMsgTranslateMap = () => {
    const { translateMap, currSessionId } = this.props;
    this.setState({
      msgTranslateMap: translateMap[currSessionId]
    })
  };

  // methods
  initSession = () => {
    const { currSessionId, serviceInfo } = this.props;
    if (currSessionId) {
      const { scene, to } = util.parseSession(currSessionId)
      let userInfo = {};
      let otherIsExpert = false;
      let user = null;
      if (/^p2p-/.test(currSessionId)) {
        user = currSessionId.replace(/^p2p-/, '');
        if (user === this.props.userUID) {
          userInfo.accid = user
          userInfo.name = '我的手机'
          userInfo.image = ''
        } else if (serviceInfo && user === serviceInfo.accid) {
          userInfo = serviceInfo
        } else {
          userInfo = this.props.iccpUserInfos[user];
          if (userInfo) {
            if (userInfo.userType === 'expert') {
              otherIsExpert = true
            }
          }
        }
      }
      this.setState({
        scene,
        to,
        userInfo,
        otherIsExpert,
      })
    }
  };

  msgsLoaded = () => {
  };

  render() {
    const { userInfo, otherIsExpert, scene, to, msgTranslateMap } = this.state;
    return (
      <PageHeaderWrapper className="history">
        <div style={{ height: '700px' }}>
          <ChatList
            type="session"
            scene={scene}
            to={to}
            userInfo={userInfo}
            otherIsExpert={otherIsExpert}
            msgsLoaded={this.msgsLoaded}
            msgTranslateMap={msgTranslateMap}
          />
        </div>;
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ im, user }) => ({
  im,
  user,
  currSessionId: im.currSessionId,
  userUID: im.userUID,
  myInfo: user.userInfo,
  serviceInfo: im.serviceInfo,
  iccpUserInfos: im.iccpUserInfos,
  translateMap: im.translateMap,
}))(History);
