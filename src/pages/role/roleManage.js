import React, { Component } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'; 
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import * as imService from '@/services/role'


export class roleManage extends Component {

  state = {
    list: [],
    currentPage:1
  }

  columns = [
    {
      title: '角色ID',
      dataIndex: 'id',
      hideInSearch:true,
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeStr',
    },
    {
      title :'角色名',
      dataIndex :'description'
    },
    {
      title: '关联账号数',
      dataIndex: 'useCount',
      hideInSearch:true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createUserId',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      render: item => moment(item).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUserId',
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      hideInSearch:true,
      render: item =>(
        <>
          <a style={{textDecoration:"underline",marginRight:"10px"}}>编辑</a>
          <a style={{textDecoration:"underline"}}>刪除</a>
        </>
      )
    },
  ]

  componentDidMount(){
    this.getRoleInfo()
  }

  getRoleInfo = async ()=>{
    const{currentPage} =this.state
    const{data:{items}}=await imService.getRoleInfo({
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

export default roleManage
