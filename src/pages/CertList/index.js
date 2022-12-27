import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, List } from 'antd';
import { DownloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import api from '../../api';
import util from '../../util';

function CertList() {
    let { number, state } = useParams();
    const [data, setData] = useState([]);
    useEffect(() => {
        api.cert.list(state || 'valid')
            .then(res => {
                // 扁平化处理
                res = res.map((item, index) => {
                    item.requestId = item.request.id;
                    item.content = `证书主体：${util.transferDN(item.subject)}`;
                    item = util.flatObj(item);
                    item.title = `证书${index + 1}`;
                    item.description = `序列号：${item.serialNumber}，有效期：${new Date(item.notBefore).toLocaleString()} - ${new Date(item.notAfter).toLocaleString()}`;
                    delete item.id;
                    return item;
                });
                setData(res);
            });
    }, [state]);
    const requestDetail = request => {
        return () => {
            console.log(request);
        };
    };
    const downloadCert = request => {
        return () => {
            api.file.downloadCert(request.requestId).then(res => {
                util.download(res, `${request.commonName}_${request.serialNumber}.crt`, 'application/x-x509-user-cert');
            });
        };
    };
    const downloadCRL = () => {
        api.file.downloadCRL().then(res => {
            util.download(res, `CRL_${new Date().toLocaleDateString()}.crl`, 'application/pkix-crl');
        });
    };
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                defaultCurrent: parseInt(number) || 1,
                pageSize: 3,
                showQuickJumper: true,
                showTotal: total =>
                    <>
                        共 {total} 条记录
                        {state === 'revoke'
                            && <>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="primary"
                                    shape="round"
                                    icon={<DownloadOutlined />}
                                    size={'small'}
                                    onClick={downloadCRL}>
                                    下载CRL
                                </Button>
                            </>
                        }
                    </>
                ,
            }}
            dataSource={data}
            renderItem={item =>
                <div style={{ pointerEvents: 'none' }}>
                    <List.Item key={item.requestId}
                        extra={
                            <div style={{ pointerEvents: 'auto', marginTop: '82px' }}>
                                <Button type="primary"
                                    shape="round"
                                    icon={<DownloadOutlined />}
                                    onClick={downloadCert(item)}>
                                    下载证书
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="default"
                                    shape="round"
                                    icon={<EllipsisOutlined />}
                                    onClick={requestDetail(item)}>
                                    查看详情
                                </Button>
                            </div>
                        }>
                        <List.Item.Meta
                            avatar={<Avatar src={'/cert.svg'} size="large" style={{ marginTop: '24px' }} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                        />
                        {item.content}
                    </List.Item>
                </div>
            }
        />
    );
}

export default React.memo(CertList);