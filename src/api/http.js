import axios from 'axios';
import qs from 'qs';

// 请求基础路径
axios.defaults.baseURL = 'http://localhost:8080/';

// 请求超时时间
axios.defaults.timeout = 10000;

// 跨域请求时是否需要使用凭证
// TODO: 测试withCredentials效果
axios.defaults.withCredentials = true;

// post数据格式
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.transformRequest = data => qs.stringify(data);
// axios.defaults.transformResponse = data => qs.parse(data);

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 获取token
        const token = localStorage.getItem('token');
        // 设置请求头
        token && (config.headers.Authorization = token);
        // 返回config
        return config;
    },
    error => {
        // 输出错误信息，仅供调试
        // console.log(error);
        return Promise.reject(error);
    }
);

// 自定义响应成功的HTTP状态码
// axios.defaults.validateStatus = status => {
//     return /^(2|3)\d{2}$/.test(status);
// };

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 返回响应数据
        return response.data;
    },
    error => {
        let { response } = error;
        if (response) {
            // 服务器响应了
            let { status } = response;
            switch (status) {
                case 401:
                    // TODD: 未登录处理
                    break;
                case 403:
                    // TODD: Token过期处理
                    localStorage.removeItem('token');
                    break;
                case 404:
                    // TODD: 页面丢失处理
                    break;
            }
            return Promise.reject(error);
        } else {
            // 服务器未响应
            if (!window.navigator.onLine) {
                // TODD: 断网处理
                return;
            }
            return Promise.reject(error);
        }
    }
);

export default axios;
