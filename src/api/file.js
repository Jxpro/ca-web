import http from './http';

const api_prefix = '/file';

export default {
    downloadCRL() {
        return http.get(`${api_prefix}/crl`, { responseType: 'blob' });
    },
    downloadCert(requestId) {
        return http.get(`${api_prefix}/cert/${requestId}`, { responseType: 'blob' });
    },
};