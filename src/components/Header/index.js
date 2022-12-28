import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, Modal, Form, Input, message } from 'antd';
import { MailOutlined, IdcardOutlined, LoadingOutlined, LockOutlined, CheckCircleOutlined, WarningOutlined, SafetyCertificateOutlined, FormOutlined, EyeOutlined, FileProtectOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import util from '../../util';
import './index.css';

function Header(props) {
    // 用于获取路由参数的hook
    let { state } = useParams();
    // 用于编程式路由的hook
    const navigate = useNavigate();
    // 从后端获取用户信息，useRef防止重复请求，function(){...}()是为了立即执行函数
    // deprecated: 由于useRef传入立即执行的函数，还是会导致每次渲染都会执行函数，因此改为useState
    // let userInfo = useRef(function () {
    //     // api.user.info().then(res => {
    //     //     return res;
    //     // }, err => {
    //     //     return undefined;
    //     // });
    //     return undefined;
    // }());
    // deprecated: StrictMode模式下，无法真正延迟显示内容，避免页面闪烁，原因未知
    // const [userInfo, setUerInfo] = useState(() => {
    //     api.user.info().then(res => {
    //         setUerInfo(res);
    //         props.over();
    //     }, () => {
    //         setUerInfo(undefined);
    //         props.over();
    //     });
    // });
    const [userInfo, setUerInfo] = useState(undefined);
    // StrictMode模式下，只能用useEffect才能真正延迟显示内容，避免页面闪烁
    /* eslint-disable react-hooks/exhaustive-deps*/
    // 需要在useEffect中，等页面渲染完才能使用消息提示框(antd/message)
    // 不然会有警告：
    // Render methods should be a pure function of props and state;
    // triggering nested component updates from render is not allowed.
    useEffect(() => {
        // 获取token
        const token = localStorage.getItem('token');
        // 如果token存在，则获取用户信息，然后显示页面
        token && api.user.info().then(res => {
            setUerInfo(res);
            props.over();
            // 如果权限不足，则返回首页
            if (state === 'unapproved' && res.role !== 'admin') {
                message.info({
                    content: '权限不足',
                    key: messageKey,
                });
                navigate('/');
            }
        }, () => {
            // 如果获取用户信息失败，则直接显示页面
            props.over();
            // 如果是需要登录的页面，则返回首页
            if (state === ('user' || 'unapproved') || window.location.pathname.split('/')[1] === 'apply') {
                navigate('/');
            }
        });
        !token && (function () {
            // 如果token不存在，则直接显示页面
            props.over();
            // 如果是需要登录的页面，则弹出登录框
            if (state === ('user' || 'unapproved') || window.location.pathname.split('/')[1] === 'apply') {
                onClickLogin();
                message.info({
                    content: '请先登录',
                    key: messageKey,
                });
            }
        }());
        // 这里暂时禁用eslint对useEffect的依赖检查，这里不影响
        // 后面可以采用redux来共享方法，可以避免使用props传递方法
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps*/

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
        setConfirmLoading(true);
        api.user.login(values).then(res => {
            setUerInfo(res);
            setConfirmLoading(false);
            setOpenModal(false);
            message.success({
                content: '登录成功',
                key: messageKey,
            });
        }, error => {
            if (error === 401) {
                setConfirmLoading(false);
                message.error({
                    content: '用户名或密码错误',
                    key: messageKey,
                });
            } else {
                setConfirmLoading(false);
                message.error({
                    content: '登录失败，请检查网络',
                    key: messageKey,
                });
            }
        });
    };
    // 提交注册表单
    const onRgister = values => {
        setConfirmLoading(true);
        api.user.register(values).then(res => {
            setUerInfo(res);
            setConfirmLoading(false);
            setOpenModal(false);
            message.success({
                content: '注册成功',
                key: messageKey,
            });
        }, error => {
            if (error === 401) {
                setConfirmLoading(false);
                message.error({
                    content: '用户名已被注册',
                    key: messageKey,
                });
            } else {
                setConfirmLoading(false);
                message.error({
                    content: '注册失败，请检查网络',
                    key: messageKey,
                });
            }
        });
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
    };
    // 取消弹窗
    const handleCancel = () => {
        // 提交表单时，点击关闭按钮不关闭弹窗，提示稍等
        if (confirmLoading) {
            message.loading({
                content: '正在请求中，请稍等！',
                key: messageKey,
            });
            return;
        }
        // 如果访问了需要登录的页面，点击关闭按钮后跳转到首页
        if (!userInfo && requireLoginItems.includes(currentNav)) {
            navigate('/');
            setCurrentNav(items[0].key);
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
            show: userInfo && userInfo.role === 'admin' ? 'true' : 'false',
        },
        {
            label:
                <a href="tencent://message/?uin=1529177144" rel="noopener noreferrer">联系我们</a>
            ,
            key: 'help',
            icon: <QuestionCircleOutlined />,
            show: 'true',
        },
    ];
    // 需要登录的导航项
    const requireLoginItems = [items[2].key, items[3].key, items[4].key];
    // 初始选中的导航项，根据当前路由来设置
    let selectedKey = state;
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
            onClickLogin();
            message.info({
                content: '请先登录',
                key: messageKey,
            });
        }
        // 如果点击的是不需要登录的导航项，或者用户已登录，则跳转到对应页面
        if (!requireLoginItems.includes(e.key) || userInfo) {
            navigate(`/${e.key}`);
            setCurrentNav(e.key);
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
                        <Button type="primary" onClick={onClickLogin}>登录</Button>&nbsp;&nbsp;
                        <Button onClick={onClickRegist}>注册</Button>
                    </>}
            </div>
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
                >
                    {!isLogin
                        && <>
                            <Form.Item
                                name="nickname"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入昵称!',
                                    },
                                ]}
                            >
                                <Input prefix={<IdcardOutlined className="site-form-item-icon" />}
                                    placeholder="Nickname" autoComplete="off" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: '邮箱格式不正确！',
                                    },
                                    {
                                        required: true,
                                        message: '请输入邮箱!',
                                    },
                                ]}
                            >
                                <Input prefix={<MailOutlined className="site-form-item-icon" />}
                                    placeholder="Email" autoComplete="off" />
                            </Form.Item></>

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
                            placeholder="Username" autoComplete="off" />
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