import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/system'


export class AccountManage extends Component {

  state = {
    list: [],
    currentPage:1
  }

  columns = [
    {
      title: '角色ID',
      dataIndex: 'userId',
      hideInSearch:true,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createdId',
    },
    {
      title: '最后登录时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch:true,
      render: item =>(
        <>
          <a style={{textDecoration:"underline",marginRight:"10px"}}>编辑</a>
          <a style={{textDecoration:"underline",marginRight:"10px"}}>重置密码</a>
          <a style={{textDecoration:"underline"}}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount(){
    this.getAccountList()
  }

  getAccountList = async ()=>{
    const{currentPage} =this.state
    const{data:{items}}=await imService.getAccountList({
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
          dataSource={list}
        />
      </PageHeaderWrapper>
    )
  }
}

export default AccountManage
