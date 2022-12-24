import {
    createBrowserRouter,
} from 'react-router-dom';

import App from '../App';
import Error from './error';
import CertList from '../pages/CertList';
import RevokeList from '../pages/RevokeList';
import MyCert from '../pages/MyCert';
import CertApply from '../pages/CertApply';
import CertApprove from '../pages/CertApprove';
import Subject from '../pages/CertApply/Subject';
import License from '../pages/CertApply/License';
import PubKey from '../pages/CertApply/PubKey';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            // 默认路由，根路径展示，第一页证书列表
            {
                // path和index二选一，效果一样
                // path: '',
                index: true,
                element: <CertList />,
            },
            // 证书列表，不带页码，默认为第一页
            {
                path: 'certList',
                element: <CertList />,
            },
            // 证书列表，带页码
            {
                path: 'certList/:number',
                element: <CertList />,
            },
            // 撤销列表，不带页码，默认为第一页
            {
                path: 'revokeList',
                element: <RevokeList />,
            },
            // 撤销列表，带页码
            {
                path: 'revokeList/:number',
                element: <RevokeList />,
            },
            // 我的证书
            {
                path: 'myCert',
                element: <MyCert />,
            },
            // 证书申请
            {
                path: 'certApply',
                element: <CertApply />,
                children: [
                    // 证书申请，第一步，填写主体信息
                    {
                        path: 'subject',
                        element: <Subject />,
                    },
                    // 证书申请，第二步，填写营业执照
                    {
                        path: 'license',
                        element: <License />,
                    },
                    // 证书申请，第三步，填写公钥信息
                    {
                        path: 'pubkey',
                        element: <PubKey />,
                    },
                ],
            },
            // 证书审批
            {
                path: 'certApprove',
                element: <CertApprove />,
            },
        ],
    },
]);

export default router;