import React, { createRef } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import VirtualList from '@/components/VirtualList';
import { v4 as uuidv4 } from 'uuid';
import ChatItem from './ChatItem';

class ChatList extends React.Component {
  // 在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    type: PropTypes.string,
    currSessionMsgs: PropTypes.array,
    userInfo: PropTypes.object,
    isHistory: PropTypes.bool,
    otherIsExpert: PropTypes.bool,
    scene: PropTypes.string,
    to: PropTypes.string,
    // 翻译字典
    msgTranslateMap: PropTypes.object,
  };

  // 如果没有传值，可以给一个默认值
  static defaultProps = {
    type: '',
    scene: '',
    to: '',
    currSessionMsgs: [],
    userInfo: {},
    isHistory: false,
    otherIsExpert: false,
    msgTranslateMap: {},
  };

  state = {
    // 当因第一次拉取历史消息导致信息错误时，直接跳转底部
    firstToBottom: 1,
    msgLoadedTimer: null,
    isNextPageLoading: false,
    msgList: [],
  };

  itemList = createRef();

  async componentDidUpdate(prevProps, prevState) {
    // 监听会话改变
    if (prevProps.currSessionId !== this.props.currSessionId) {
      this.scrollToBottom(1);
    }
    // 监听消息列表改变
    if (prevProps.currSessionMsgs !== this.props.currSessionMsgs) {
      this.initMsgList()
    }
    // 监听消息列表改变
    if (prevProps.noMoreHistoryMsgs !== this.props.noMoreHistoryMsgs) {
      this.initMsgList()
    }
    // 监听消息列表改变
    if (prevState.msgList !== this.state.msgList && this.state.msgList.length !== 0) {
      if (this.state.firstToBottom >= 0) {
        this.scrollToBottom();
      } else {
        const prevLastMsg = prevState.msgList[prevState.msgList.length - 1];
        const lastMsg = this.state.msgList[this.state.msgList.length - 1];
        if (prevLastMsg && lastMsg) {
          if (prevLastMsg.idClient !== lastMsg.idClient) {
            this.scrollToBottom();
          }
        }
      }
    }
  }

  initMsgList = () => {
    const { currSessionMsgs, noMoreHistoryMsgs } = this.props;
    const msgList = [...currSessionMsgs];
    // 没有数据的时候，在数组顶部
    if (noMoreHistoryMsgs) {
      const msg = {
        flow: 'noMore',
        idClient: uuidv4(),
      };
      msgList.unshift(msg);
    }
    this.setState({
      msgList
    })
  }

  showFullImg = src => {
    this.props.dispatch('showFullscreenImg', {
      src,
    });
  };

  msgLoaded = () => {
    clearTimeout(this.state.msgLoadedTimer);
    this.state.msgLoadedTimer = setTimeout(() => {
      this.props.msgsLoaded();
    }, 20);
  };

  renderItem = (msg, index, measure) => {
    const { userInfo, myInfo, type, isHistory, msgTranslateMap, otherIsExpert, currSessionId } = this.props;
    return <ChatItem
      type={type}
      rawMsg={msg}
      userInfo={userInfo}
      myInfo={myInfo}
      key={msg.idClient || index}
      isHistory={isHistory}
      measure={measure}
      msgLoaded={this.msgLoaded}
      translate={msgTranslateMap[msg.idClient]}
      currSessionId={currSessionId}
      otherIsExpert={otherIsExpert}
    />
  }

  scrollToBottom = (firstToBottom) => {
    const { firstToBottom: firstToBottomOld } = this.state;
    this.setState({
      firstToBottom: firstToBottom || firstToBottomOld - 1
    })
    this.itemList.current.list.scrollToRow(this.props.currSessionMsgs.length);
  }

  loadMore = () => {
    const { scene, to, noMoreHistoryMsgs } = this.props;
    if (!noMoreHistoryMsgs) {
      this.setState({
        isNextPageLoading: true
      })
      this.props.dispatch({
        type: 'im/getHistoryMsgs',
        scene,
        to,
      }).then(() => {
        this.setState({
          isNextPageLoading: false
        })
      });
    }
  }

  render() {
    const { noMoreHistoryMsgs } = this.props;
    const { isNextPageLoading, msgList } = this.state;
    return (
      <div id="chat-list" className="chat-list">
        {/* <Button onClick={()=>{this.itemList.current.list.scrollToRow(0)}}>top</Button>
        <Button onClick={()=>{this.itemList.current.list.scrollToRow(msgList.length)}}>bottom</Button> */}
        <VirtualList
          ref={this.itemList}
          data={msgList}
          itemRender={this.renderItem}
          /** 有下一页 */
          hasNextPage={!noMoreHistoryMsgs}
          /** 正在加载 */
          isNextPageLoading={isNextPageLoading}
          /** 加载下一页 */
          loadNextPage={this.loadMore}
        />
      </div>
    );
  }
}
export default connect(({ im, user }) => ({
  currSessionId: im.currSessionId,
  myInfo: user.userInfo,
  currSessionMsgs: im.currSessionMsgs,
  noMoreHistoryMsgs: im.noMoreHistoryMsgs,
}))(ChatList);
