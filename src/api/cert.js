import http from './http';

const api_prefix = '/cert';

export default {
    list(state) {
        return http.get(`${api_prefix}/${state}`);
    },
};