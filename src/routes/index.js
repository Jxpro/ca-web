import {
    createBrowserRouter, Navigate,
} from 'react-router-dom';

import App from '../App';
import Error from './error';
import CertList from '../pages/CertList';
import CertApply from '../pages/CertApply';
import Subject from '../pages/CertApply/Subject';
import License from '../pages/CertApply/License';
import PubKey from '../pages/CertApply/PubKey';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            // 默认路由，根路径默认展示第一页有效证书列表
            {
                // path和index二选一，效果一样
                // path: '',
                index: true,
                element: <CertList />,
            },
            // 证书列表，不带页码，默认为第一页
            // state 为证书状态，可选值为：
            // 1. valid(已通过)
            // 2. revoke(已撤销)
            // 3. unapproved(待审核)
            // 4. user(用户所属)
            {
                path: 'list/:state',
                element: <CertList />,
            },
            // 证书列表，带页码
            {
                path: 'list/:state/:number',
                element: <CertList />,
            },
            // 证书申请
            {
                path: 'apply',
                element: <CertApply />,
                children: [
                    // 默认重定向到第一步
                    {
                        path: '',
                        element: <Navigate to="subject" />,
                    },
                    // 证书申请，第一步，填写主体信息
                    {
                        path: 'subject',
                        element: <Subject />,
                    },
                    // 证书申请，第二步，填写公钥信息
                    {
                        path: 'pubkey',
                        element: <PubKey />,
                    },
                    // 证书申请，第三步，填写营业执照
                    {
                        path: 'license',
                        element: <License />,
                    },
                ],
            },
        ],
    },
]);

export default router;