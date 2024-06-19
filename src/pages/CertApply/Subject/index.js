import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

function Subject() {
    const navigate = useNavigate();
    const onFinish = values => {
        api.cert.applySubject(values).then(() => {
            message.success('提交成功');
            navigate('/apply/pubkey');
        });
    };
    return (
        <Form
            name="subject"
            onFinish={onFinish}
            autoComplete="off"
            style={{ padding: '42px 420px' }}
            labelCol={{ span: 4 }}
        >
            <Form.Item
                label="姓名"
                name="commonName"
                rules={[
                    {
                        required: true,
                        message: '请输入姓名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="组织" name="organization"><Input /></Form.Item>
            <Form.Item label="部门" name="organizationalUnit"><Input /></Form.Item>
            <Form.Item label="国家" name="country"><Input /></Form.Item>
            <Form.Item label="省份/州" name="stateOrProvinceName"><Input /></Form.Item>
            <Form.Item label="邮箱" name="email"><Input /></Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button type="primary" htmlType="reset">
                        重置
                    </Button>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default React.memo(Subject);