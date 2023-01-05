import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

function License() {
    const navigate = useNavigate();
    const [file, setFile] = useState(undefined);
    const [uploading, setUploading] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('files[]', file);
        setUploading(true);
        api.cert.applyLicense(formData).then(() => {
            setUploading(false);
            setFile(undefined);
        });
    };
    const beforeUpload = file => {
        setFile(file);
        return false;
    };
    return (
        <>
            <br />
            <Dragger beforeUpload={beforeUpload} onRemove={() => setFile(undefined)} maxCount={1}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">点击或拖到文件到此上传</p>
            </Dragger>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button type="primary" onClick={() => { navigate(-1); }}>
                    上一步
                </Button>
                <Button type="primary" htmlType="reset" onClick={() => setFile(undefined)}>
                    重置
                </Button>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={!file}
                    loading={uploading}
                >
                    点击上传
                </Button>
            </div>
        </>
    );
}

export default React.memo(License);