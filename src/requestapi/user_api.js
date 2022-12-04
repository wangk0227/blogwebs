import service from './index'


export function post_user_code() {
    return service({
        url: 'adminHome/loginCode/img/',
        method: 'post',
    })
}
export function delete_user_code() {
    return service({
        url: 'adminHome/loginCode/img/',
        method: 'delete',
    })
}

export function post_user_login(data) {
    return service({
        url: 'adminHome/users/logins/',
        method: 'post',
        data: data,
    })
}

export function login_out() {
    return service({
        url: 'adminHome/users/quit/',
        method: 'delete',
    })
}

export function get_data_all() {
    return service({
        url: 'adminHome/users/viewing/',
        method: 'get',
    })
}

export function del_user(id) {
    return service({
        url: 'adminHome/users/viewing/?user_id=' + id ,
        method: 'delete',
    })
}

export function get_user(id) {
    return service({
        url: 'adminHome/users/viewing/?user_id=' + id ,
        method: 'get',
    })
}
export function get_user_page(page) {
    return service({
        url: 'adminHome/users/viewing/?page=' + page ,
        method: 'get',
    })
}

export function update_user(id,data){
    return service({
        url: 'adminHome/users/update/' + id  + '/',
        method: 'put',
        data:data
    })
}

export function create_user(data){
    return service({
        url:'adminHome/users/register/',
        method:'post',
        data:data
    })
}