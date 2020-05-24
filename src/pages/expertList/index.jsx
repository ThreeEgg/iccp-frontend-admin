import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import router from 'umi/router';
import {
  expertGetList,
  expertNotify,
  expertResetPassword,
  expertUpdateStatus,
} from '@/services/expert';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import { queryRule, updateRule, addRule, removeRule } from './service';
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = props => {
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [total, setTotal] = useState(0);
  const actionRef = useRef();

  const gotoChat = chatItem => {
    // 发起会话
    props.dispatch({
      type: 'im/initSession',
      serviceAccid: props.imInfo.accid,
      userAccid: chatItem.userImId,
      to: chatItem.userImId,
    });
    router.push('/chat/im');
  };
  const gotoHistory = chatItem => {
    // 发起会话
    props.dispatch({
      type: 'im/initSession',
      serviceAccid: props.imInfo.accid,
      userAccid: chatItem.userImId,
      to: chatItem.userImId,
    });
    router.push('/chat/history');
  };

  const sendNotify = item => {
    Modal.confirm({
      content: '确认发送邮件提醒该专家即使更新日程表',
      okText: '发送',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await expertNotify({ userId: item.userId });
        if (result.code === '0') {
          message.success('发送成功');
        }
      },
    });
  };

  const resetPassword = item => {
    Modal.confirm({
      content: `确认将用户‘${item.userId}’的密码重置为USER123456`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        const result = await expertResetPassword({ userId: item.userId });
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
        const result = await expertUpdateStatus({ userId: item.userId, isValid });
        if (result.code === '0') {
          message.success('操作成功');
          actionRef.current.reload();
        }
      },
    });
  };

  const columns = [
    {
      title: '专家ID',
      dataIndex: 'userId',
    },
    {
      title: '专家名称',
      dataIndex: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '专家国籍',
      dataIndex: 'countryCode',
      formItemProps: {
        placeholder: '请输入国家码，如CHN',
      },
      hideInForm: true,
      render: (_, record) => `${record.cname}(${record.countryCode})`,
    },
    {
      title: '联系方式',
      // dataIndex: 'email',
      hideInForm: true,
    },
    {
      title: '所属公司',
      dataIndex: 'serviceUserId',
      hideInSearch: true,
    },
    {
      title: '职务',
      dataIndex: 'serviceUserName',
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
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
      hideInSearch: true,
    },
    {
      title: '本周日程安排',
      dataIndex: 'schdlupdtime',
      valueEnum: {
        0: { text: '未设置' },
        1: { text: '已设置' },
      },
      render: text => {
        if (!text) {
          return '未设置';
        }

        if (Date.now() - Date.parse(new Date(text)) > 7 * 24 * 3600 * 1000) {
          return '未设置';
        }
        return '已设置';
      },
    },
    {
      title: '已沟通用户数',
      dataIndex: 'chatCount',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a>详细资料</a>,
        <a onClick={() => sendNotify(record)}>日程提醒</a>,
        <a onClick={() => updateStatus(record)}>{record.isValid > 0 ? '停用' : '启用'}</a>,
        <a onClick={() => resetPassword(record)}>重置密码</a>,
      ],
    },
  ];

  return (
    <PageHeaderWrapper className="customer-service-list">
      <ProTable
        rowKey="userId"
        headerTitle="专家查询"
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
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => message.warn('开发中')}>
            <PlusOutlined /> 专家批量导入
          </Button>,
          <Button type="primary" onClick={() => message.warn('开发中')}>
            <PlusOutlined /> 头像批量导入
          </Button>,
          //   <Button type="primary" onClick={() => handleModalVisible(true)}>
          //     <PlusOutlined /> 新增
          // </Button>,
        ]}
        request={params => {
          params.pageNum = params.current;
          delete params.current;
          delete params._timestamp;
          if (params.createTime) {
            params.createDateFrom = params.createTime[0];
            params.createDateTo = params.createTime[1];
            delete params.createTime;
          }

          return expertGetList(params);
        }}
        postData={data => {
          setTotal(data.pageInfo.totalResults);
          return data.items;
        }}
        tableAlertRender={false}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async value => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};
export default connect(({ user }) => ({
  imInfo: user.imInfo,
}))(TableList);
