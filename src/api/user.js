import http from './http';

const api_prefix = '/user';

export default {
    // 登录
    login(data) {
        return http.post(api_prefix + '/login', data);
    },
    // 注册
    register(data) {
        return http.post(api_prefix + '/register', data);
    },
    // 退出登录
    logout() {
        return http.post(api_prefix + '/logout');
    },
    // 获取用户信息
    getUserInfo() {
        return http.get(api_prefix + '/info');
    },
};