import React from 'react';
import { Modal, message } from 'antd';
import util from 'iccp-frontend-im/dist/utils'
import PropTypes from 'prop-types';

const { confirm } = Modal;
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
class ChatItem extends React.Component {
  // 在这里进行类型检测(这里的名字不是随便自定义的，规定这样写的)
  static propTypes = {
    rawMsg: PropTypes.object,
    userInfo: PropTypes.object,
    myInfo: PropTypes.object,
    isHistory: PropTypes.bool,
    otherIsExpert: PropTypes.bool,
    translate: PropTypes.string,
    currSessionId: PropTypes.string,
  };

  // 如果没有传值，可以给一个默认值
  static defaultProps = {
    rawMsg: {},
    userInfo: {},
    myInfo: {},
    isHistory: false,
    otherIsExpert: false,
    translate: '',
    currSessionId: '',
  };

  state = {
    msg: '',
    isFullImgShow: false,
    msgUnRead: false,
    icon1: `/im/ic_im_failed.svg`,
  };

  componentWillMount() {
    this.computedItem()
  }

  componentDidMount() {
    // window.stopPlayAudio = this.stopPlayAudio.bind(this)
    const item = this.state.msg
    let media = null
    if (item.type === 'image') {
      // 图片消息缩略图
      media = new Image()
      media.src = `${item.file.url}?imageView&thumbnail=180x0&quality=85`
    } else if (item.type === 'custom-type1') {
      // 猜拳消息
      media = new Image()
      media.className = 'emoji-middle'
      media.src = item.imgUrl
    } else if (item.type === 'custom-type3') {
      // 贴图表情
      media = new Image()
      media.className = 'emoji-big'
      media.src = item.imgUrl
    } else if (item.type === 'custom-image') {
      const scale = 12.5
      // 自定义图片
      media = new Image()
      media.className = 'custom-image'
      media.src = item.imgUrl
      let { width, height } = item
      if (width > height) {
        if (width > scale) {
          height = scale * height / width;
          width = scale
          this.setState({
            isFullImgShow: true,
          })
        }
      } else if (height > scale) {
        width = scale * width / height;
        height = scale
        this.setState({
          isFullImgShow: true,
        })
      }
      this.refs.mediaMsg.style.width = `${width}rem`
      this.refs.mediaMsg.style.height = `${height}rem`
    } else if (item.type === 'video') {
      if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
        media = document.createElement('video')
        media.src = item.file.url
        media.width = 640
        media.height = 480
        media.autoStart = false
        media.preload = 'metadata'
        media.controls = 'controls'
      } else {
        const aLink = document.createElement('a')
        aLink.href = item.file.url
        aLink.target = '_blank'
        aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
        this.refs.mediaMsg.appendChild(aLink)
      }
    }

    if (media) {
      if (this.refs.mediaMsg) {
        this.refs.mediaMsg.appendChild(media)
      }
      media.onload = () => {
        this.props.msgLoaded();
      }
      media.onerror = () => {
        this.props.msgLoaded();
      }
    } else {
      this.props.msgLoaded();
    }
    this.props.measure();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.rawMsg !== this.props.rawMsg) {
      const newCustom = this.props.rawMsg && this.props.rawMsg.localCustom
      if (!newCustom || !this.props.rawMsg || this.props.rawMsg.type !== 'audio') {
        return
      }
      const oldCustom = prevProps.rawMsg && prevProps.rawMsg.localCustom
      if (newCustom !== oldCustom) {
        this.computedItem()
      }
    }
    if (prevProps.userInfo !== this.props.userInfo) {
      this.computedItem()
    }
    if (prevProps.translate !== this.props.translate) {
      this.props.measure();
    }
  }

  // computed
  msgUnRead = () => {
    // var obj = !this.props.isHistory
    //   && this.state.msg.needMsgReceipt
    //   && this.state.msg.flow === 'out'
    //   && this.props.teamMsgReads.find(item => item.idServer === this.state.msg.idServer)
    // this.setState({
    //   msgUnRead: obj ? parseInt(obj.unread) : -1
    // })
  }

  // methods
  computedItem = () => {
    const item = Object.assign({}, this.props.rawMsg)
    // 标记用户，区分聊天室、普通消息
    if (this.props.type === 'session') {
      let defaultIcon = config.defaultUserIcon;
      if (item.flow === 'in') {
        if (this.props.userInfo.userType === 'user' || this.props.userInfo.userType === 'guest') {
          defaultIcon = config.defaultClientIcon;
        }
        item.avatar = (this.props.userInfo && this.props.userInfo.image) || defaultIcon
        item.name = this.props.userInfo && this.props.userInfo.name || ''
      } else if (item.flow === 'out') {
        item.name = this.props.myInfo && this.props.myInfo.name || ''
        if (this.props.myInfo.type === 'user' || this.props.myInfo.type === 'guest') {
          defaultIcon = config.defaultMeIcon;
          item.name = ''
        }
        item.avatar = (this.props.myInfo && this.props.myInfo.image) || defaultIcon
      }
    } else {
      // 标记时间，聊天室中
      item.showTime = util.formatDate(item.time)
    }
    if (item.type === 'timeTag') {
      // 标记发送的时间
      item.showText = item.text
    } else if (item.type === 'text') {
      // 文本消息
      item.showText = util.escape(item.text)
      if (/\[[^\]]+\]/.test(item.showText)) {
        const emojiItems = item.showText.match(/\[[^\]]+\]/g)
        emojiItems.forEach(text => {
          // let emojiCnt = emojiObj.emojiList.emoji
          // if (emojiCnt[text]) {
          //   item.showText = item.showText.replace(text, `<img className="emoji-small" src="${emojiCnt[text].img}">`)
          // }
        })
      }
    } else if (item.type === 'custom') {
      const content = JSON.parse(item.content.replace(/\n\r/g, "<br>").replace(/\r\n/g, "<br>").replace(/\n/g, "<br>").replace(/\r/g, "<br>"))
      // 10提示信息
      if (content.type === 10) {
        item.showText = content.data.value
      }
      // 11文件信息
      else if (content.type === 11) {
        item.type = 'custom-file'
        item.fileLink = content.data.webUrl
        item.showText = content.data.oldFileName
      }
      // 12图片信息
      else if (content.type === 12) {
        item.type = 'custom-image'
        // 原始图片全屏显示
        item.originLink = content.data.webUrl
        item.imgUrl = content.data.webUrl
        item.width = content.data.width
        item.height = content.data.height
      }
      // 13视频信息
      else if (content.type === 13) {
        // 视频消息
      } else {
        item.showText = util.parseCustomMsg(item)
        if (item.showText !== '[自定义消息]') {
          item.showText += ',请到手机或电脑客户端查看'
        }
      }
    } else if (item.type === 'image') {
      // 原始图片全屏显示
      item.originLink = item.file.url
    } else if (item.type === 'video') {
      // ...
    } else if (item.type === 'audio') {
      item.width = `${(5.3 + Math.round(item.file.dur / 1000) * 0.03).toFixed(2)}rem`
      item.audioSrc = item.file.mp3Url
      item.showText = `<i>${Math.round(item.file.dur / 1000)}"</i> 点击播放`
      // if (!this.isHistory && nim.useDb) {
      //   item.unreadAudio = !item.localCustom
      // }
    } else if (item.type === 'file') {
      item.fileLink = item.file.url
      item.showText = item.file.name
    } else if (item.type === 'notification') {
      if (item.scene === 'team') {
        item.showText = util.generateTeamSysmMsg(item)
      } else {
        // 对于系统通知，更新下用户信息的状态
        item.showText = util.generateChatroomSysMsg(item)
      }
    } else if (item.type === 'tip') {
      // 对于系统通知，更新下用户信息的状态
      item.showText = item.tip
    } else {
      item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
    }
    this.setState({
      msg: item
    })

  }

  revocateMsg = (vNode) => {
    // 在会话聊天页
    if (this.props.currSessionId) {
      if (vNode && vNode.data && vNode.data.attrs) {
        const attrs = vNode.data.attrs
        if (attrs.type === 'robot') {
          return
        }
        // 自己发的消息
        if (attrs.flow === 'out') {
          const that = this
          confirm({
            title: '确定需要撤回消息?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
              that.props.dispatch({
                type: 'im/revocateMsg',
                idClient: attrs.idClient
              })
            },
            onCancel() {
            },
          });
        }
      }
    }
  }

  showFullImg = (src) => {
    if (this.state.isFullImgShow) {
      const newwin = window.open()
      const myimg = newwin.document.createElement("img")
      myimg.src = src
      newwin.document.body.appendChild(myimg)
    }
  }

  getTranslate = (idClient) => {
    this.props.dispatch({
      type: 'im/getTranslate',
      idClient,
      callback: (res) => {
        if (res.code === '0') {
          if (res.data.flag === 0) {
            this.props.dispatch({
              type: 'im/saveTranslate',
              sessionId: this.props.currSessionId,
              idClient,
              translate: res.data.translate,
            });
          } else {
            message.error(res.data.msg)
          }
        }
      },
    });
  };

  render() {
    const { msg, msgUnRead, icon1 } = this.state;
    const { type, userInfo, translate, otherIsExpert } = this.props;
    return (
      msg.flow === 'noMore' ?
        <div className="item-more"> ---- 已无更多记录 ---- </div> :
        /* 信息类型 */
        <div className={
          `chat-msg ${msg.flow === 'out' ? 'item-me' : ''} ${msg.flow === 'in' ? 'item-you' : ''} ${msg.type === 'timeTag' ? 'item-time' : ''} ${msg.type === 'tip' ? 'item-tip' : ''} ${type === 'session' ? 'session-chat' : ''} `}>
          {/* 信息头信息 */}
          {['timeTag', 'tip', 'notification'].includes(msg.type) && <div className={
            `${msg.type === 'tip' && 'tip'}
          ${msg.type === 'notification' && msg.scene === 'team' && 'notification'}
          `}>---- {msg.showText} ----</div>}
          {(!['timeTag', 'tip', 'notification'].includes(msg.type) && (msg.flow === 'in' || msg.flow === 'out')) &&
            <div className='msg-box'
              data-idclient={msg.idClient}
              data-time={msg.time}
              data-flow={msg.flow}
              data-type={msg.type}
              onClick={this.revocateMsg}
            >
              {/* 信息来源 */}
              {msg.avatar && msg.type !== 'notification' &&
                <span className={`msg-head ${otherIsExpert && 'pointer'}`}>
                  <img src={msg.avatar} />
                </span>
              }
              {msg.name &&
                <span className="msg-name" >{msg.name}</span>
              }
              {/* 信息主体 */}
              <div className="msg-content">
                {/* 信息内容 */}
                {msg.type === 'text' &&
                  <div className="msg-text" dangerouslySetInnerHTML={{ __html: msg.showText }} />
                }
                {(msg.type === 'custom-type1' || msg.type === 'custom-type3' || msg.type === 'video') &&
                  <div className="msg-text" ref="mediaMsg" />
                }
                {(msg.type === 'image' || msg.type === 'custom-image') &&
                  <div className="msg-text msg-image" ref="mediaMsg" onClick={this.showFullImg.bind(this, msg.originLink)} />
                }
                {msg.type === 'audio' &&
                  <div className={`msg-text msg-audio ${msg.unreadAudio && 'unreadAudio'}`} style={{ width: msg.width }} ref="mediaMsg" onClick={this.playAudio.bind(this, msg)} dangerouslySetInnerHTML={{ __html: msg.showText }} />
                }
                {(msg.type === 'file' || msg.type === 'custom-file') &&
                  <div className="msg-text"><a href={msg.fileLink} target="_blank">{msg.showText}</a></div>
                }
                {msg.type === 'robot' &&
                  <div className="msg-text">功能暂未开放</div>
                }
                {msg.type === 'notification' &&
                  <div className="msg-text notify">{msg.showText}</div>
                }
                {!['text', 'custom-type1', 'custom-type3', 'custom-image', 'video', 'image', 'audio', 'custom-file', 'file', 'robot', 'notification'].includes(msg.type) &&
                  <div className="msg-text custom" dangerouslySetInnerHTML={{ __html: msg.showText }} />
                }
                {/* 翻译 */}
                {msg.type === 'text' && msg.flow === 'in' &&
                  <div className="msg-translate" onClick={this.getTranslate.bind(this, msg.idClient)}>{!translate && '翻译'}</div>
                }
                {translate &&
                  <div className="msg-text-translate" dangerouslySetInnerHTML={{ __html: translate }} />
                }
                {/* 发送失败 */}
                {msg.status === 'fail' &&
                  <span className="msg-failed"><img src={icon1} /></span>
                }
                {/* 回执标志 */}
                {msg.flow === 'out' && msg.status !== 'fail' &&
                  <span className={`msg-unread ${!msgUnRead && 'read'}`}>{msgUnRead ? '未读' : ''}</span>
                }
              </div>
              <div className='clear' />
            </div>
          }
        </div >
    );
  }
}
export default ChatItem;