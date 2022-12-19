import React, { useState } from 'react';
import { Button, Layout, Menu, Modal, Form, Input, message } from 'antd';
import { IdcardOutlined, LoadingOutlined, LockOutlined, CheckCircleOutlined, WarningOutlined, SafetyCertificateOutlined, FormOutlined, EyeOutlined, FileProtectOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import api from '../../api';
import './index.css';

// 接收一个中英文字符串，中文算2个字符，英文算1个字符
// 最后返回一个长度为6个字符的字符串加上...，
// 如果字符串长度小于6个字符则不加...
function getShortName(name) {
    let shortName = '';
    let count = 0;
    for (let i = 0; i < name.length; i++) {
        if (name.charCodeAt(i) > 255) {
            count += 2;
        } else {
            count += 1;
        }
        if (count > 6) {
            break;
        }
        shortName += name[i];
    }
    if (count > 6) {
        shortName += '...';
    }
    return shortName;
}

function Header() {
    console.log('render Header');
    // 从后端获取用户信息，useRef防止重复请求，function(){...}()是为了立即执行函数
    // deprecated: 由于useRef传入立即执行的函数，还是会导致每次渲染都会执行函数，因此改为useState
    // let userInfo = useRef(function () {
    //     // api.user.getUserInfo().then(res => {
    //     //     return res;
    //     // }, err => {
    //     //     return undefined;
    //     // });
    //     console.log('get user info');
    //     return undefined;
    // }());
    const [userInfo, setUerInfo] = useState(() => {
        console.log('get user info');
        // api.user.getUserInfo().then(res => {
        //     return res;
        // }, err => {
        //     return undefined;
        // });
        return { name: 'admmmmmmmmmmmmm', role: 'admin' };
    });

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
            show: userInfo && userInfo.role === 'admin' ? 'true' : 'false',
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

    // 登录注册
    // 消息提示框key
    const messageKey = 'message';
    // 控制登录还是注册
    const [isLogin, setLoginMode] = useState(false);
    // 控制登录注册弹窗
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // 提交登录表单
    const onLogin = values => {
        console.log('Received values of form: ', values);
        setConfirmLoading(true);
        // api.user.login(values).then(res => {
        //     console.log(res);
        //     setUerInfo(res);
        //     setConfirmLoading(false);
        //     setOpenModal(false);
        //     message.success({
        //         content: '登录成功',
        //         key: messageKey,
        //     });
        // }, err => {
        //     console.log(err);
        //     setConfirmLoading(false);
        //     message.error({
        //         content: '用户名或密码错误',
        //         key: messageKey,
        //     });
        // });
    };
    // 提交注册表单
    const onRgister = values => {
        console.log('Received values of form: ', values);
        setConfirmLoading(true);
        // api.user.register(values).then(res => {
        //     console.log(res);
        //     setUerInfo(res);
        //     setConfirmLoading(false);
        //     setOpenModal(false);
        //     message.success({
        //         content: '注册成功',
        //         key: messageKey,
        //     });
        // }, err => {
        //     console.log(err);
        //     setConfirmLoading(false);
        //     message.error({
        //         content: '注册失败',
        //         key: messageKey,
        //     });
        // });
    };
    // 退出登录
    const onLogout = () => {
        // 删除本地存储的token
        localStorage.removeItem('token');
        // 重置用户信息
        setUerInfo(undefined);
        // 提示退出成功
        message.success({
            content: '退出成功',
            key: messageKey,
        });
        // 发送退出请求，让后端删除token
        // 未删除的话也不影响，因为本地已无token，无法通过验证
        // api.user.logout().then(res => {
        //     console.log(res);
        // });
    };
    // 取消弹窗
    const handleCancel = () => {
        // 提交表单时，点击关闭按钮不关闭弹窗，提示稍等
        if (confirmLoading) {
            // message.loading({
            //     content: '正在请求中，请稍等！',
            //     key: messageKey,
            // });
            return;
        }
        setOpenModal(false);
    };
    // 点击登录按钮
    const onClickLogin = () => {
        setLoginMode(true);
        setOpenModal(true);
    };
    // 点击注册按钮
    const onClickRegist = () => {
        setLoginMode(false);
        setOpenModal(true);
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
                    {userInfo
                        ? <>
                            <span>{getShortName(userInfo.name)}</span>&nbsp;&nbsp;
                            <Button type="primary" danger onClick={onLogout}>登出</Button>
                        </>
                        : <>
                            <Button type="primary" onClick={onClickLogin}>登录</Button>&nbsp;&nbsp;
                            <Button onClick={onClickRegist}>注册</Button>
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
            <Modal
                title={<div style={{ textAlign: 'center' }}>{isLogin ? '登录' : '注册'}</div>}
                open={openModal}
                confirmLoading={confirmLoading}
                footer={null}
                destroyOnClose={true}
                onCancel={handleCancel}
            >
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={isLogin ? onLogin : onRgister}
                >{!isLogin
                    && <Form.Item
                        name="nickname"
                        rules={[
                            {
                                required: true,
                                message: '请输入昵称!',
                            },
                        ]}
                    >
                        <Input prefix={<IdcardOutlined className="site-form-item-icon" />}
                            placeholder="Nickname" />
                    </Form.Item>
                    }
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    {!isLogin
                        && <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: '两次密码输入不一致!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次密码输入不一致!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Confirm"
                            />
                        </Form.Item>}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            {confirmLoading && <LoadingOutlined />} {isLogin ? '登录' : '注册'}
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button className="login-form-button"
                            onClick={isLogin ? onClickRegist : onClickLogin}
                            disabled={confirmLoading}>
                            {isLogin ? '还没账号，去注册' : '已有账号，去登录'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout.Header>
    );
}

export default React.memo(Header);