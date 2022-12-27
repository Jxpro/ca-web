import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, List, Modal, Badge, Descriptions } from 'antd';
import { DownloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import api from '../../api';
import util from '../../util';

function CertList() {
    let { number, state } = useParams();
    const [dataList, setDataList] = useState([]);
    const isApprove = state === 'unapproved';
    useEffect(() => {
        // 获取证书列表
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
                setDataList(res);
            });
    }, [state]);

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
    const downloadLicense = () => {
        api.file.downloadLicense(presentRequest.contentHash).then(res => {
            util.download(res, `${presentRequest.originName}`, 'application/pdf');
        });
    };

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [presentRequest, setPresentRequest] = useState({});
    const requestDetail = request => {
        return () => {
            setIsDetailOpen(true);
            setPresentRequest(request);
        };
    };
    const switchState = request => {
        let state = request.state;
        if (state === '已通过' && new Date(request.notAfter).getTime() < new Date().getTime()) {
            state = '已过期';
        }
        switch (state) {
            case '已通过':
                return <Badge status="processing" text="有效" />;
            case '已撤销':
                return <Badge status="error" text="撤销" />;
            case '已过期':
                return <Badge status="default" text="过期" />;
        }
    };
    const handleOk = () => {
        downloadCert(presentRequest)();
        setIsDetailOpen(false);
    };
    const handleCancel = () => {
        setIsDetailOpen(false);
    };
    const handleAccept = () => {
        api.cert.accept(presentRequest.requestId).then(res => {
            console.log(res);
        });
        setIsDetailOpen(false);
    };
    const handleReject = e => {
        // 如果e.target不是svg标签，说明点击了拒绝按钮，需要发送请求
        // 否则点击的是右上角x，直接关闭弹窗，不需要发送请求
        if (e.target.tagName !== 'svg') {
            api.cert.reject(presentRequest.requestId).then(res => {
                console.log(res);
            });
        }
        setIsDetailOpen(false);
    };

    return (
        <>
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
                dataSource={dataList}
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
            <Modal
                centered={true}
                maskClosable={false}
                open={isDetailOpen}
                okText={isApprove ? '通过' : '下载'}
                cancelText={isApprove ? '拒绝' : '关闭'}
                onOk={isApprove ? handleAccept : handleOk}
                onCancel={isApprove ? handleReject : handleCancel}>
                <Descriptions title="证书详情" layout="vertical" size="small" bordered>
                    <Descriptions.Item label="序列号">{presentRequest.serialNumber}</Descriptions.Item>
                    <Descriptions.Item label="有效期" span={2}>
                        {`${new Date(presentRequest.notBefore).toLocaleString()} 至 ${new Date(presentRequest.notAfter).toLocaleString()}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="姓名">{presentRequest.commonName}</Descriptions.Item>
                    <Descriptions.Item label="组织">{presentRequest.organization}</Descriptions.Item>
                    <Descriptions.Item label="部门">{presentRequest.organizationalUnit}</Descriptions.Item>
                    <Descriptions.Item label="国家">{presentRequest.countryName}</Descriptions.Item>
                    <Descriptions.Item label="省份">{presentRequest.provinceName}</Descriptions.Item>
                    <Descriptions.Item label="邮箱">{presentRequest.email}</Descriptions.Item>
                    <Descriptions.Item label="营业执照">
                        <a href={'./'} onClick={e => { e.preventDefault(); downloadLicense(); }}>{presentRequest.contentHash}.pdf</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="公钥算法">{presentRequest.algorithm}</Descriptions.Item>
                    <Descriptions.Item label={presentRequest.algorithm === 'RSA' ? '密钥长度' : '曲线参数'}>
                        {presentRequest.algorithm === 'RSA' ? presentRequest.keySize : presentRequest.curveName}
                    </Descriptions.Item>
                    <Descriptions.Item label="参数1">{presentRequest.param1}</Descriptions.Item>
                    <Descriptions.Item label="参数2">{presentRequest.param2}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {switchState(presentRequest)}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
}

export default React.memo(CertList);