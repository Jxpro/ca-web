import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, message } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../api';

function Login(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { state } = useLocation();
    const from = state?.from || '/';
    const messageKey = 'message';

    // 提交注册表单
    const onLogin = values => {
        setLoading(true);
        api.user.login(values).then(() => {
            setLoading(false);
            message.success({
                content: '登录成功',
                key: messageKey,
            });
            // 如果有关闭弹窗的回调函数，则执行
            // 如果没有回调函数，则跳转到来源页面
            props.cancle ? props.cancle(false) : navigate(from);
        }, error => {
            setLoading(false);
            message.error({
                content: error === 401 ? '用户名或密码错误' : '注册失败，请检查网络',
                key: messageKey,
            });
        });
    };
    // 切换注册窗口
    const onSwitchRegister = () => {
        props.cancle ? props.cancle(true)
            : navigate(from, {
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
        props.cancle ? props.cancle(false) : navigate(from);
    };

    return (
        <Modal title={<div style={{ textAlign: 'center' }}>登录</div>}
            confirmLoading={loading}
            onCancel={handleCancel}
            open={true}
            footer={null}>
            <Form name="register" onFinish={onLogin}>
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
                <Form.Item>
                    <Button type="primary" htmlType="submit">{loading && <LoadingOutlined />}登录</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button disabled={loading} onClick={onSwitchRegister}>没有账号？去注册</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default React.memo(Login);