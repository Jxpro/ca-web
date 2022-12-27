import http from './http';

const api_prefix = '/cert';

export default {
    list(state) {
        return http.get(`${api_prefix}/${state}`);
    },
    accept(requestId) {
        return http.post(`${api_prefix}/approve`, { id: requestId, passed: true });
    },
    reject(requestId) {
        return http.post(`${api_prefix}/approve`, { id: requestId, passed: false });
    },
};