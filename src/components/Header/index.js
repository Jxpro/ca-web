import { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { CheckCircleOutlined, WarningOutlined, SafetyCertificateOutlined, FormOutlined, EyeOutlined, FileProtectOutlined, QuestionCircleOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import './index.css';

function Header() {
    // 下面需要获取用户信息
    let userInfo = undefined;
    // TODO: 从后端获取用户信息

    // 导航项
    // 将true or false改为字符串形式，否则react会警告：Received `true` for a non-boolean attribute `show`.
    const items = [
        {
            label: '证书列表',
            key: 'certList',
            icon: <CheckCircleOutlined />,
            show: 'true',
        },
        {
            label: '撤销列表',
            key: 'CRLs',
            icon: <WarningOutlined />,
            show: 'true',
        },
        {
            label: '我的证书',
            key: 'myCert',
            icon: <FileProtectOutlined />,
            show: 'true',
        },
        {
            label: '证书申请',
            key: 'certApply',
            icon: <FormOutlined />,
            show: 'true',
        },
        {
            label: '证书审核',
            key: 'certCheck',
            icon: <EyeOutlined />,
            show: 'true',
            // TODO: 需要判断用户是否为管理员
        },
        {
            label:
                // TODO: 处理联系方式
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                    联系我们
                </a>
            ,
            key: 'help',
            icon: <QuestionCircleOutlined />,
            show: 'true',
        },
    ];
    const [currentNav, setCurrentNav] = useState('certList');
    const onClickNav = e => {
        // 点击联系我们时不处理路由
        if (e.key === 'help') { return; }
        setCurrentNav(e.key);
        // TODO: 处理路由
    };

    return (
        <Layout.Header className="header">
            <div className="logo" >
                <div className="content">
                    <SafetyCertificateOutlined />&nbsp;
                    <span>CA系统</span>
                </div>
            </div>
            <div className="user-info" >
                <div className="content">
                    <UserOutlined />
                    &nbsp;&nbsp;
                    {userInfo ? <span>userInfo.name</span> : <>
                        <Button type="primary">登录</Button>
                        &nbsp;
                        <Button >注册</Button>
                    </>}
                </div>
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                onClick={onClickNav}
                selectedKeys={[currentNav]}
                defaultSelectedKeys={['certList']}
                items={items.filter(item => item.show === 'true')}
            />
        </Layout.Header>
    );
}

export default Header;