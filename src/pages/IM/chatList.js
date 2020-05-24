import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/im'
import router from 'umi/router';

export class chatList extends Component {
  state = {
    list: [],
    currentPage:1
  }

  columns = [
    {
      title: '用户ID',
      dataIndex: 'clientUserId',
      hideInSearch:true,
    },
    {
      title: '用户昵称',
      dataIndex: 'clientUserName',
    },
    {
      title: '专家ID',
      dataIndex: 'expertUserId',
      hideInSearch:true,
    },
    {
      title: '专家名称',
      dataIndex: 'expertUserName',
    },
    {
      title: '聊天创建时间',
      dataIndex: 'firstChatTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'chatId',
      valueType: 'option',
      hideInSearch:true,
      render: item =>(
        <div style={{display:"flex"}}>
          <div style={{marginRight:"5px" }}>
            <a>查看聊天详情</a>
          </div>
          <div style={{marginRight:"5px" }}>
            <a>查看案件信息表</a>
          </div>
          <div style={{marginRight:"5px" }}>  
            <a style={{textDecoration:"underline"}} onClick={()=>{this.gotoChatDetail(item)}}>查看通话记录</a>
          </div>
        </div>
      )
    },
  ]

  

  componentDidMount(){
    this.getChatList()
  }

  gotoChatDetail = (item)=>{
    // console.log(item)
    router.push(`/im/list/record?chatId=${item}`)
  }

  getChatList = async ()=>{
    const{currentPage} =this.state
    const{data:{items}}=await imService.getChatList({
      pageNum:currentPage,
      pageSize:10
    })
    this.setState({
      list:items
    })
  }

  render() {
    const {columns} = this;
    const {list} = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          columns={columns}
          // headerTitle="聊天列表"
          dataSource={list}
        />
      </PageHeaderWrapper>
      
    )
  }
}

export default chatList
