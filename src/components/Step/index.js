import React, { useMemo } from 'react';
import { FilePdfOutlined, KeyOutlined, ProfileOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

function Step() {
    const stepName = window.location.pathname.split('/')[2];
    const current = useMemo(() => ({ subject: 0, pubkey: 1, license: 2 }[stepName]), [stepName]);
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