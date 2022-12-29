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
    if (requireAdmin) {
        api.user.info().then(res => res.role === 'admin' && (isAdmin = true));
        return isAdmin ? children : <Navigate to="/" replace state={{ errorMsg: '权限不足' }} />;
    }
    return children;
}

export default AuthRoute;