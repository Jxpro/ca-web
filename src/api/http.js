import { message } from 'antd';
import axios from 'axios';
import qs from 'qs';

// 请求基础路径
axios.defaults.baseURL = 'http://localhost:8080/';

// 请求超时时间
axios.defaults.timeout = 10000;

// 跨域请求时是否需要使用凭证
// 测试withCredentials效果：需前后端配合使用
// 配置了withCredentials，后端Access-Control-Allow-Origin不能为*，必须指定具体的域名
// axios.defaults.withCredentials = true;

// post数据格式
// axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = data => qs.stringify(data);
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
        return Promise.reject(error);
    }
);

// 自定义响应成功的HTTP状态码
// axios.defaults.validateStatus = status => {
//     return /^(2|3)\d{2}$/.test(status);
// };

// 响应拦截器
// 服务器响应就算成功(200)，具体处理结果要看响应数据中的code(200,201,401,403)
// 如果是文件流，则没有code，直接返回响应数据
axios.interceptors.response.use(
    response => {
        // 如果响应数据中有token，则更新本地token
        const token = response.headers.authorization;
        token && localStorage.setItem('token', token);
        // 处理响应数据
        const res = response.data;
        switch (res.code) {
            case undefined:
                return res;
            case 200:
                return res.data;
            case 201:
                return true;
            case 401:
                localStorage.removeItem('token');
                return Promise.reject(res.code);
            case 403:
                message.error({
                    content: '权限不足，请联系管理员',
                    key: 'message',
                });
                return Promise.reject(res.code);
        }
    },
    error => {
        // 断网或服务器错误
        message.error({
            content: window.navigator.onLine ? '服务器繁忙，请稍微再试' : '网络错误，请检查网络后再试',
            key: 'message',
        });
        return Promise.reject(error);
    }
);

export default axios;
