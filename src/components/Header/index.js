import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Layout, Menu, message } from 'antd';
import { CheckCircleOutlined, WarningOutlined, SafetyCertificateOutlined, FormOutlined, EyeOutlined, FileProtectOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import api from '../../api';
import util from '../../util';
import Login from '../Login';
import Register from '../Register';
import './index.css';

function Header(props) {
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const [isLogin, setIsLogin] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [userInfo, setUerInfo] = useState(undefined);
    const token = localStorage.getItem('token');
    const messageKey = 'message';

    useEffect(() => {
        if (!userInfo) {
            // 如果token存在，则获取用户信息，如果token过期，则清除token，最后显示页面
            token && api.user.info().then(res => setUerInfo(res)).finally(() => props.over());
            // 如果token不存在，则直接显示页面
            !token && props.over();
        }
        if (state?.errorMsg) {
            message.error({
                content: state.errorMsg,
                key: messageKey,
            });
            // 清除错误信息，避免下次进入时还显示错误信息
            navigate(pathname, { state: { errorMsg: '', from: state.from }, replace: true });
        }
    }, [navigate, props, userInfo, token, state, pathname]);

    // 导航项
    // 将true or false改为字符串形式，否则react会警告：Received `true` for a non-boolean attribute `show`.
    const items = [
        {
            label: '证书列表',
            key: 'list/valid',
            icon: <CheckCircleOutlined />,
            show: 'true',
        },
        {
            label: '撤销列表',
            key: 'list/revoke',
            icon: <WarningOutlined />,
            show: 'true',
        },
        {
            label: '我的证书',
            key: 'list/user',
            icon: <FileProtectOutlined />,
            show: 'true',
        },
        {
            label: '证书申请',
            key: 'apply',
            icon: <FormOutlined />,
            show: 'true',
        },
        {
            label: '证书审核',
            key: 'list/unapproved',
            icon: <EyeOutlined />,
            show: userInfo?.role === 'admin' ? 'true' : 'false',
        },
        {
            label: <a href="tencent://message/?uin=1529177144" rel="noopener noreferrer">联系我们</a>,
            key: 'help',
            icon: <QuestionCircleOutlined />,
            show: 'true',
        },
    ];
    // 需要登录的导航项
    const requireLoginItems = [items[2].key, items[3].key, items[4].key];
    // 初始选中的导航项，根据当前路由来设置
    let { state: selectedKey } = useParams();
    if (selectedKey) {
        // 如果是list下的路由，则可以直接拼接导航项的key
        selectedKey = 'list/' + selectedKey.toLocaleLowerCase();
    } else if (window.location.pathname.split('/')[1]) {
        // 如果当前路由不是根路径，也不是list子路径，则一定是items[4].key (apply)
        selectedKey = items[4].key;
    } else {
        // 否则就是根路径，选中证书列表
        selectedKey = items[0].key;
    }
    // 设置当前选中的导航项
    const [currentNav, setCurrentNav] = useState(selectedKey);
    //  点击导航项
    const onClickNav = e => {
        // 点击联系我们时不处理路由
        if (e.key === 'help') { return; }
        // 如果点击的是需要登录的导航项，且用户未登录，则弹出登录窗口
        if (requireLoginItems.includes(e.key) && !userInfo) {
            message.info({
                content: '请先登录',
                key: messageKey,
            });
            setIsLogin(true);
        }
        // 如果点击的是不需要登录的导航项，或者用户已登录，则跳转到对应页面
        if (!requireLoginItems.includes(e.key) || userInfo) {
            navigate(`/${e.key}`);
            setCurrentNav(e.key);
        }
    };
    // 取消登录的回调，toRegister为true时，取消登录后显示注册窗口
    const cancleLogin = toRegister => {
        setIsLogin(false);
        toRegister && setIsRegister(true);
    };
    // 取消注册的回调，toLogin为true时，取消注册后显示登录窗口
    const cancleRegister = toLogin => {
        setIsRegister(false);
        toLogin && setIsLogin(true);
    };
    // 退出登录
    const onLogout = () => {
        // 删除本地存储的token，无需让后端删除token
        // 因为本地已无token，后续请求将无法通过验证
        localStorage.removeItem('token');
        // 重置用户信息
        setUerInfo(undefined);
        // 提示退出成功
        message.success({
            content: '退出成功',
            key: messageKey,
        });
        if (requireLoginItems.includes(currentNav)) {
            navigate('/');
            setCurrentNav(items[0].key);
        }
    };
    return (
        <Layout.Header className="header">
            <div className="logo">
                <SafetyCertificateOutlined />&nbsp;
                <span>CA系统</span>
            </div>
            <Menu
                className="navList"
                theme="dark"
                mode="horizontal"
                onClick={onClickNav}
                selectedKeys={[currentNav]}
                items={items.filter(item => item.show === 'true')}
            />
            <div className="user-info">
                <UserOutlined />
                &nbsp;&nbsp;
                {userInfo
                    ? <>
                        <span>{util.getShortString(userInfo.name)}</span>&nbsp;&nbsp;
                        <Button type="primary" danger onClick={onLogout}>登出</Button>
                    </>
                    : <>
                        <Button type="primary" onClick={() => setIsLogin(true)}>登录</Button>&nbsp;&nbsp;
                        <Button type="default" onClick={() => setIsRegister(true)}>注册</Button>
                    </>}
            </div>
            {isLogin ? <Login cancle={cancleLogin} /> : ''}
            {isRegister ? <Register cancle={cancleRegister} /> : ''}
        </Layout.Header>
    );
}

export default React.memo(Header);