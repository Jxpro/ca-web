import http from './http';

const api_prefix = '/cert';

export default {
    list(state) {
        return http.get(`${api_prefix}/${state}`);
    },
    uncompletedCert() {
        return http.get(`${api_prefix}/user/uncompleted`);
    },
    applySubject(subject) {
        return http.post(`${api_prefix}/apply/subject`, subject);
    },
    applyPubKey(pubKey) {
        return http.post(`${api_prefix}/apply/publicKey`, pubKey);
    },
    applyLicense(license) {
        return http.post(`${api_prefix}/apply/license`, license);
    },
    accept(requestId) {
        return http.post(`${api_prefix}/approve`, { id: requestId, passed: true });
    },
    reject(requestId) {
        return http.post(`${api_prefix}/approve`, { id: requestId, passed: false });
    },
    revoke(requestId) {
        return http.post(`${api_prefix}/revoke`, { id: requestId });
    },
};