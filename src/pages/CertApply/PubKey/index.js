import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message, Select } from 'antd';
import api from '../../../api';

function PubKey() {
    const navigate = useNavigate();
    const onFinish = values => {
        api.cert.applyPubKey(values).then(() => {
            message.success('提交成功');
            navigate('/apply/license');
        });
    };
    return (
        <Form
            name="pubkey"
            onFinish={onFinish}
            autoComplete="off"
            style={{ padding: '42px 420px' }}
            labelCol={{ span: 4 }}
        >
            <Form.Item
                label="算法"
                name="algorithm"
                rules={[
                    {
                        required: true,
                        message: '请选择算法!',
                    },
                ]}
            >
                <Select
                    placeholder="选择算法并填写相应参数"
                    allowClear
                >
                    <Select.Option value="RSA-2048">RSA-2048</Select.Option>
                    <Select.Option value="EC-prime256v1">EC-prime256v1</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="参数1"
                name="param1"
                rules={[
                    {
                        required: true,
                        message: '请输入参数1!',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="参数2"
                name="param2"
                rules={[
                    {
                        required: true,
                        message: '请输入参数2!',
                    },
                ]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button type="primary" onClick={() => { navigate(-1); }}>
                        上一步
                    </Button>
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

export default React.memo(PubKey);