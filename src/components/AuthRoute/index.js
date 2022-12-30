import { Navigate, useLocation } from 'react-router-dom';
import api from '../../api';

function AuthRoute(props) {
    const { pathname } = useLocation();
    const { children, requireAdmin } = props;
    const token = localStorage.getItem('token');
    let isAdmin = false;
    if (!token) {
        return <Navigate to="/login" replace state={{ errorMsg: '请先登录', from: pathname }} />;
    }
    const userinfo = token.split('.')[1];
    const { role } = JSON.parse(decodeURIComponent(window.atob(userinfo)));
    if (requireAdmin) {
        // 发一次请求给后端，防止token被篡改，如果token被篡改，则后端会返回401，然后前端会清除token
        api.user.info();
        isAdmin = role === 'admin' ? true : false;
        return isAdmin ? children : <Navigate to="/" replace state={{ errorMsg: '权限不足' }} />;
    }
    return children;
}

export default AuthRoute;