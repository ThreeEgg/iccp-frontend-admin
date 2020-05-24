import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';
import './Dashboard.less';

const CodePreview = ({ children }) => (
  <pre className="pre">
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageHeaderWrapper>
    <Card></Card>
  </PageHeaderWrapper>
);
