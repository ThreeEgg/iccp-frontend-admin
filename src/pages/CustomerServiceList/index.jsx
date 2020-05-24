import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import router from 'umi/router';
import { caseChatList } from '@/services/case';
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

  const columns = [
    {
      title: '客户类型',
      dataIndex: 'userTypeStr',
      valueType: 'option',
    },
    {
      title: '客户ID',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: '客户名称',
      dataIndex: 'clientUserName',
      hideInForm: true,
      renderText: val => `${val} 万`,
    },
    {
      title: '聊天创建时间',
      dataIndex: 'firstChatTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
    },
    {
      title: '最后聊天时间',
      dataIndex: 'lastChatTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
    },
    {
      title: '当前客服ID',
      dataIndex: 'serviceUserId',
      hideInSearch: true,
    },
    {
      title: '当前客服',
      dataIndex: 'serviceUserName',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => gotoChat(record)}>对话</a>
          <Divider type="vertical" />
          <a onClick={() => gotoHistory(record)}>查看聊天记录</a>
          <Divider type="vertical" />
          <a href="">更换客服</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper className="customer-service-list">
      <ProTable
        rowKey="id"
        headerTitle="客服对话查询"
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
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        request={params => {
          params.pageNum = params.current;
          delete params.current;
          delete params._timestamp;
          if (params.firstChatTime) {
            params.firstChatTimeBegin = params.firstChatTime[0];
            params.firstChatTimeEnd = params.firstChatTime[1];
            delete params.firstChatTime;
          }

          if (params.lastChatTime) {
            params.lastChatTimeBegin = params.lastChatTime[0];
            params.lastChatTimeEnd = params.lastChatTime[1];
            delete params.lastChatTime;
          }
          return caseChatList(params);
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
