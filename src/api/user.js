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
            role: 'user',
            password: sha256(data.password),
        });
    },
    // 获取用户信息
    info() {
        return http.get(api_prefix + '/info');
    },
};