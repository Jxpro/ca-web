import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, message } from 'antd';
import { MailOutlined, IdcardOutlined, LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../api';

function Register(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const from = state?.from || '/';
    const messageKey = 'message';

    // 提交注册表单
    const onRegister = values => {
        setLoading(true);
        api.user.register(values).then(() => {
            setLoading(false);
            message.success({
                content: '注册成功',
                key: messageKey,
            });
            // 如果有关闭弹窗的回调函数，则执行
            // 如果没有回调函数，则跳转到来源页面
            props.cancle ? props.cancle(false) : navigate(from);
        }, error => {
            setLoading(false);
            message.error({
                content: error === 401 ? '用户名已被注册' : '注册失败，请检查网络',
                key: messageKey,
            });
        });
    };
    // 切换注册窗口
    const onSwitchLogin = () => {
        props.cancle ? props.cancle(true)
            : navigate('/login', {
                replace: true,
                state: { from },
            });
    };
    // 取消弹窗
    const handleCancel = () => {
        // 提交表单时，点击关闭按钮不关闭弹窗，提示稍等
        if (loading) {
            message.loading({
                content: '正在请求中，请稍等！',
                key: messageKey,
            });
            return;
        }
        // 如果有关闭弹窗的回调函数，则执行
        // 如果没有回调函数，则跳转到来源页面
        props.cancle ? props.cancle(false) : navigate('/');
    };

    return (
        <Modal title={<div style={{ textAlign: 'center' }}>注册</div>}
            confirmLoading={loading}
            onCancel={handleCancel}
            open={true}
            footer={null}>
            <Form name="register" onFinish={onRegister}>
                <Form.Item name="nickname"
                    rules={[
                        {
                            required: true,
                            message: '请输入昵称!',
                        },
                    ]}>
                    <Input prefix={<IdcardOutlined />} placeholder="Nickname" autoComplete="off" />
                </Form.Item>
                <Form.Item name="email"
                    rules={[
                        {
                            type: 'email',
                            message: '邮箱格式不正确！',
                        },
                        {
                            required: true,
                            message: '请输入邮箱!',
                        },
                    ]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" autoComplete="off" />
                </Form.Item>
                <Form.Item name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" autoComplete="off" />
                </Form.Item>
                <Form.Item name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}>
                    <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item name="confirm"
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
                    ]}>
                    <Input.Password prefix={<LockOutlined />} type="password" placeholder="Confirm" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">{loading && <LoadingOutlined />}注册</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button disabled={loading} onClick={onSwitchLogin}>已有账号？去登录</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default React.memo(Register);