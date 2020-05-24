import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { userList, userUpdateStatus, userResetPassword } from '@/services/userManage';

const TableList = props => {
  const [sorter, setSorter] = useState('');
  const [total, setTotal] = useState(0);
  const actionRef = useRef();

  const resetPassword = item => {
    Modal.confirm({
      content: `确认将用户‘${item.userId}’的密码重置为USER123456`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await userResetPassword({ userId: item.userId });
        if (result.code === '0') {
          message.success('操作成功');
        }
      },
    });
  };

  const updateStatus = item => {
    // 置反
    const isValid = item.isValid > 0 ? 0 : 1;
    Modal.confirm({
      content: `确认${isValid > 0 ? '启用' : '停用'}用户${item.userId}的账号`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await userUpdateStatus({ userId: item.userId, isValid });
        if (result.code === '0') {
          message.success('操作成功');
          actionRef.current.reload();
        }
      },
    });
  };

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '用户昵称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: '账号状态',
      dataIndex: 'isValid',
      valueEnum: {
        0: {
          text: '停用中',
        },
        1: {
          text: '启用中',
        },
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
      hideInSearch: true,
    },
    {
      title: '已沟通专家',
      dataIndex: 'chatCount',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a onClick={() => updateStatus(record)}>{record.isValid > 0 ? '停用' : '启用'}</a>,
        <a onClick={() => resetPassword(record)}>重置密码</a>,
      ],
    },
  ];

  return (
    <PageHeaderWrapper className="customer-service-list">
      <ProTable
        rowKey="userId"
        headerTitle="用户列表"
        actionRef={actionRef}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;

          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        pagination={{
          defaultCurrent: 1,
          total,
          showQuickJumper: true,
          showLessItems: true,
          showSizeChanger: true,
        }}
        request={params => {
          params.pageNum = params.current;
          delete params.current;
          delete params._timestamp;
          if (params.createTime) {
            params.registryDateFrom = params.createTime[0];
            params.registryDateTo = params.createTime[1];
            delete params.createTime;
          }

          return userList(params);
        }}
        postData={data => {
          setTotal(data.pageInfo.totalResults);
          return data.items;
        }}
        tableAlertRender={false}
        columns={columns}
        rowSelection={{}}
      />
    </PageHeaderWrapper>
  );
};
export default connect(({ user }) => ({
  imInfo: user.imInfo,
}))(TableList);
