import {createStore} from 'vuex'
import {get_token, get_user_data, get_menu_name} from '../utlis/cookie'

export default createStore({
    state: {
        token: get_token(),
        user_data: get_user_data(),
        menu_name: get_menu_name() || '博客Admin',
    },
    getters: {
        // 计算属性
        get_token() {
            return state.token
        }
    },
    mutations: {},
    actions: {},
    modules: {}
})
