import { sha256 } from 'js-sha256';

import http from './http';

const api_prefix = '/user';

export default {
    // 登录
    login(data) {
        return http.post(api_prefix + '/login', {
            ...data,
            password: sha256(data.password),
        });
    },
    // 注册
    register(data) {
        delete data.confirm;
        return http.post(api_prefix + '/register', {
            ...data,
            authority: 0,
            password: sha256(data.password),
        });
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