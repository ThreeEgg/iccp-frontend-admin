import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import logo from '../assets/logo.svg';
import './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className="container">
        <div className="$1">{/* <SelectLang /> */}</div>
        <div className="content">
          <div className="top">
            <div className="header">
              <Link to="/">
                <img alt="logo" className="logo" src={logo} />
                <span className="title">国际风险平台管理端</span>
              </Link>
            </div>
            {/* <div className='desc'>Ant Design 是西湖区最具影响力的 Web 设计规范</div> */}
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
