import axios from 'axios';
import { Cookie, Store } from 'le5le-store';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = false;

// http request 拦截器
axios.interceptors.request.use(
  (config: any) => {
    config.headers.Authorization = Cookie.get(process.env.VUE_APP_TOKEN) || '';
    return config;
  },
  (err: any) => Promise.reject(err)
);

// http response 拦截器
axios.interceptors.response.use(
  (response: any) => {
    if (response.data.error) {
      Store.set('api error', response.data.error);
    }
    return response.data;
  },
  (error: any) => {
    Store.set('http error', error.response);
    return Promise.reject(error.response.data);
  }
);

export default axios;
