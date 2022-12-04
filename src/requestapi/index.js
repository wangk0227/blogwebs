import axios from "axios";
import store from '../store'
import {get_token} from '../utlis/cookie'
const service = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/', // 修改为后端的地址
    timeout: 5000, // 请求超时时间

})


service.interceptors.request.use(config => {
    // 携带请求头访问
    let token = store.state.token || get_token()
    if(token){
        config.headers['AcceptToken'] =token
        return config
    }
    return config
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use( response=> {
    let res_data = response.data
    if (res_data.code.toLocaleString() === '505'){
        return Promise.reject(res_data.error);
    }else if(res_data.code.toLocaleString() === '404'){
        return Promise.reject(res_data.error);
    }else if(res_data.code.toLocaleString() === '504'){
        return Promise.reject(res_data.error);
    }else if(res_data.code.toLocaleString() === '401'){
        return Promise.reject(res_data.error);
    }if(res_data.code.toLocaleString() === '403'){
        return Promise.reject(res_data.error);
    }
    return response;
}, error => {
    // 错误提示信息 信息会被调用的axios捕获
    return Promise.reject(error);
});
export default service //抛出一个axios的对象 可以进行使用