import { useState } from 'react';
import { Button, Layout, Menu, Modal, Checkbox, Form, Input, message } from 'antd';
import { LoadingOutlined, LockOutlined, CheckCircleOutlined, WarningOutlined, SafetyCertificateOutlined, FormOutlined, EyeOutlined, FileProtectOutlined, QuestionCircleOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import api from '../../api';
import './index.css';

function Header() {
    // 获取用户信息
    const [userInfo, setUserInfo] = useState(undefined);
    // 从后端获取用户信息
    // api.user.getUserInfo().then(res => {
    //     setUserInfo(res);
    // }, err => {
    //     console.log(err);
    // });


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

    // 登录注册
    // 提示框
    const [messageApi, contextHolder] = message.useMessage();
    // 控制登录还是注册
    const [isLogin, setLoginMode] = useState(false);
    // 控制登录或注册的跳转按钮
    const [disableLogin, setDisableLogin] = useState(false);
    const [disableRegister, setDisableRegister] = useState(false);
    // 控制登录注册弹窗
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // 提交登录表单
    const onFinishLogin = values => {
        console.log('Received values of form: ', values);
        setConfirmLoading(true);
        setDisableRegister(true);
        // api.user.login(values).then(res => {
        //     console.log(res);
        //     setConfirmLoading(false);
        //     setOpenModal(false);
        //     messageApi.open({
        //         type: 'success',
        //         content: '登录成功',
        //     });
        // }, err => {
        //     console.log(err);
        //     setConfirmLoading(false);
        //     messageApi.open({
        //         type: 'error',
        //         content: '用户名或密码错误',
        //     });
        // });
    };
    // 提交注册表单
    const onFinishRgister = values => {
        console.log('Received values of form: ', values);
        setConfirmLoading(true);
        setDisableLogin(true);
        // api.user.register(values).then(res => {
        //     console.log(res);
        //     setConfirmLoading(false);
        //     setOpenModal(false);
        //     messageApi.open({
        //         type: 'success',
        //         content: '注册成功',
        //     });
        // }, err => {
        //     console.log(err);
        //     setConfirmLoading(false);
        //     messageApi.open({
        //         type: 'error',
        //         content: '注册失败',
        //     });
        // });
    };
    // 取消弹窗
    const handleCancel = () => {
        // 提交表单时，点击关闭按钮，不关闭弹窗
        if (confirmLoading) { return; }
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
                    {userInfo ? <span>userInfo.name</span> : <>
                        <Button type="primary" onClick={onClickLogin}>登录</Button>
                        &nbsp;
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
            {/* 消息提示占位框 */}
            {contextHolder}
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
                    onFinish={isLogin ? onFinishLogin : onFinishRgister}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                                    message: 'Please confirm your password!',
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
                            disabled={isLogin ? disableRegister : disableLogin}>
                            {isLogin ? '还没账号，去注册' : '已有账号，去登录'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout.Header>
    );
}

export default Header;