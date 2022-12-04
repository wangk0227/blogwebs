import cookie from 'vue-cookie'
import {menu_names, tokens, user_datas} from './config'

export const get_token = () => {
    return cookie.get(tokens)
}

export const get_user_data = () => {
    return cookie.get(user_datas)
}
export const get_menu_name = () => {
    return cookie.get(menu_names)
}

export const save_token = (data, time) => {
    if (time) {
        cookie.set(tokens, data, time)
    } else {
        cookie.set(tokens, data, "0")
    }
}

export const save_user_data = (data, time) => {
    if (time) {
        cookie.set(user_datas, data, time)
    } else {
        cookie.set(user_datas, data, "0")
    }
}
export const save_menu_name = (data, time) => {
    if (time) {
        cookie.set(menu_names, data, time)
    } else {
        cookie.set(menu_names, data, "0")
    }
}

export const del_cookie = (data) => {
    cookie.delete(data)
}

