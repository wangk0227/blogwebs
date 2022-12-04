// 配置一些公用变量
import md5 from 'js-md5';

export const tokens = 'token'
export const user_datas = 'user_data'
export const menu_names = 'menu_name'

export const BASE_URL = "http://127.0.0.1:8000/" // 修改为后端的地址


export function pwd_md5(pwd) {
    let hash = md5.create()
    hash.update(pwd)
    hash.update(BASE_URL) // 加盐
    return hash.hex()
}

