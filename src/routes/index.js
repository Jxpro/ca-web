import {
    createBrowserRouter, Navigate,
} from 'react-router-dom';

import App from '../App';
import Error from './error';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CertList from '../pages/CertList';
import CertApply from '../pages/CertApply';
import Subject from '../pages/CertApply/Subject';
import PubKey from '../pages/CertApply/PubKey';
import AuthRoute from '../components/AuthRoute';

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
            // 登录弹窗
            {
                path: 'login',
                element: <Login />,
            },
            // 注册弹窗
            {
                path: 'register',
                element: <Register />,
            },
            // 公开证书列表，不带页码，默认为第一页
            {
                path: 'list/valid',
                element: <CertList />,
            },
            {
                path: 'list/revoke',
                element: <CertList />,
            },
            // 证书列表，带页码
            {
                path: 'list/valid/:number',
                element: <CertList />,
            },
            {
                path: 'list/revoke/:number',
                element: <CertList />,
            },
            // 私有证书列表，不带页码，默认为第一页
            {
                path: 'list/user',
                element: <AuthRoute ><CertList /></AuthRoute>,
            },
            {
                path: 'list/unapproved',
                element: <AuthRoute requireAdmin={true}><CertList /></AuthRoute>,
            },
            // 证书列表，带页码
            {
                path: 'list/user/:number',
                element: <AuthRoute ><CertList /></AuthRoute>,
            },
            {
                path: 'list/unapproved/:number',
                element: <AuthRoute requireAdmin={true}><CertList /></AuthRoute>,
            },
            // 证书申请
            {
                path: 'apply',
                element: <AuthRoute ><CertApply /></AuthRoute>,
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
                ],
            },
        ],
    },
]);

export default router;