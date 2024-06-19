import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, List, Modal, Badge, Descriptions } from 'antd';
import { DownloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import api from '../../api';
import util from '../../util';

function CertList() {
    let { number } = useParams();
    const [dataList, setDataList] = useState([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [presentRequest, setPresentRequest] = useState({});
    const listState = window.location.pathname.split('/')[2];
    const isApprove = listState === 'unapproved';
    useEffect(() => {
        // 获取证书列表
        api.cert.list(listState || 'valid').then(res => {
            setDataList(util.flatRes(res));
        });
    }, [listState]);

    const requestDetail = request => {
        return () => {
            setIsDetailOpen(true);
            setPresentRequest(request);
        };
    };
    const switchState = request => {
        let requestState = request.state;
        if (requestState === '已通过' && new Date(request.notAfter).getTime() < new Date().getTime()) {
            requestState = '已过期';
        }
        switch (requestState) {
            case '已通过':
                return <Badge status="processing" text="有效" />;
            case '已撤销':
                return <Badge status="error" text="撤销" />;
            case '已过期':
                return <Badge status="default" text="过期" />;
            case '待审核':
                return <Badge status="warning" text="待审" />;
            case '未通过':
                return <Badge status="error" text="拒绝" />;
        }
    };
    const downloadCert = request => {
        return () => {
            api.file.downloadCert(request.requestId).then(res => {
                util.download(res, `${request.commonName}_${request.serialNumber}.crt`, 'application/x-x509-user-cert');
            });
        };
    };
    const downloadRootCert = () => {
        api.file.downloadRootCert().then(res => {
            util.download(res, 'root.crt', 'application/x-x509-ca-cert');
        });
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
    const handleDownload = () => {
        downloadCert(presentRequest)();
        setIsDetailOpen(false);
    };
    const handleCancel = () => {
        setIsDetailOpen(false);
    };
    const handleAccept = () => {
        api.cert.accept(presentRequest.requestId).then(res => {
            setDataList(util.flatRes(res));
        });
        setIsDetailOpen(false);
    };
    const handleReject = e => {
        // 如果点击的是拒绝按钮，则调用接口 (antd自动将拒绝之间加了一个空格)
        if (e.target.innerText === '拒 绝') {
            api.cert.reject(presentRequest.requestId).then(res => {
                setDataList(util.flatRes(res));
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
                    // +number: 将字符串转为数字
                    defaultCurrent: +number || 1,
                    pageSize: 3,
                    showQuickJumper: true,
                    showTotal: total =>
                        <>
                            共 {total} 条记录
                            &nbsp;&nbsp;&nbsp;
                            <Button type="primary"
                                shape="round"
                                icon={<DownloadOutlined />}
                                size={'small'}
                                onClick={listState === 'revoke' ? downloadCRL : downloadRootCert}>
                                {listState === 'revoke' ? '下载CRL' : '下载根证书'}
                            </Button>
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
                onOk={isApprove ? handleAccept : handleDownload}
                onCancel={isApprove ? handleReject : handleCancel}>
                <Descriptions title="证书详情" layout="vertical" size="small" bordered>
                    <Descriptions.Item label="序列号">{presentRequest.serialNumber}</Descriptions.Item>
                    <Descriptions.Item label="有效期" span={2}>
                        {presentRequest.notBefore && `${new Date(presentRequest.notBefore).toLocaleString()} 至 ${new Date(presentRequest.notAfter).toLocaleString()}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="姓名">{presentRequest.commonName}</Descriptions.Item>
                    <Descriptions.Item label="组织">{presentRequest.organization || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="部门">{presentRequest.organizationalUnit || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="国家">{presentRequest.country || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="省份">{presentRequest.stateOrProvinceName || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="邮箱">{presentRequest.email || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="营业执照" span={2}>
                        {presentRequest.contentHash ? <a href={'./'} onClick={e => { e.preventDefault(); downloadLicense(); }}>{presentRequest.contentHash}.pdf</a> : '未上传'}
                    </Descriptions.Item>
                    <Descriptions.Item label="公钥算法">{presentRequest.algorithm}</Descriptions.Item>
                    <Descriptions.Item label="参数1">{presentRequest.param1 && util.getShortString(presentRequest.param1)}</Descriptions.Item>
                    <Descriptions.Item label="参数2">{presentRequest.param2 && util.getShortString(presentRequest.param2)}</Descriptions.Item>
                    <Descriptions.Item label="Status"> {switchState(presentRequest)} </Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
}

export default React.memo(CertList);