import { lazy, Suspense } from 'react';
import {
    createBrowserRouter,
} from 'react-router-dom';

const App = lazy(() => import('../App'));
const Error = lazy(() => import('./error'));
const CertList = lazy(() => import('../pages/CertList'));
const RevokeList = lazy(() => import('../pages/RevokeList'));
const MyCert = lazy(() => import('../pages/MyCert'));
const CertApply = lazy(() => import('../pages/CertApply'));
const Subject = lazy(() => import('../pages/CertApply/Subject'));
const License = lazy(() => import('../pages/CertApply/License'));
const PubKey = lazy(() => import('../pages/CertApply/PubKey'));
const CertApprove = lazy(() => import('../pages/CertApprove'));


const router = createBrowserRouter([
    {
        path: '/',
        element:
            <Suspense fallback={<div>Loading...</div>}>
                <App />
            </Suspense>
        ,
        errorElement: <Error />,
        children: [
            // 默认路由，根路径展示，第一页证书列表
            {
                index: true,
                element: <CertList />,
            },
            // 证书列表，不带页码，默认为第一页
            {
                path: 'certlist',
                element: <CertList />,
            },
            // 证书列表，带页码
            {
                path: 'certlist/:number',
                element: <CertList />,
            },
            // 撤销列表，不带页码，默认为第一页
            {
                path: 'revokelist',
                element: <RevokeList />,
            },
            // 撤销列表，带页码
            {
                path: 'revokelist/:number',
                element: <RevokeList />,
            },
            // 我的证书
            {
                path: 'mycert',
                element: <MyCert />,
            },
            // 证书申请
            {
                path: 'certapply',
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
                path: 'certapprove',
                element: <CertApprove />,
            },
        ],
    },
]);

export default router;