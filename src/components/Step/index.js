import React from 'react';
import { FilePdfOutlined, KeyOutlined, ProfileOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

function Step() {
    let stepName = window.location.pathname.split('/')[2];
    let current = 0;
    switch (stepName) {
        case 'subject':
            current = 0;
            break;
        case 'pubkey':
            current = 1;
            break;
        case 'license':
            current = 2;
            break;
        default:
            current = 0;
            break;
    }
    return (
        <Steps
            style={{
                padding: '0 200px',
            }}
            current={current}
            items={[
                {
                    title: 'Subject',
                    icon: <ProfileOutlined />,
                },
                {
                    title: 'Public Key',
                    icon: <KeyOutlined />,
                },
                {
                    title: 'License',
                    icon: <FilePdfOutlined />,
                },
            ]}
        />
    );
}

export default Step;