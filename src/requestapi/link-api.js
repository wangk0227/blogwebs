import service from './index'


export function get_link_data() {
    return service({
        url: 'adminHome/links/',
        method: 'get',
    })
}

export function get_link_data_page(page) {
    return service({
        url: 'adminHome/links/?page=' + page,
        method: 'get',
    })
}

export function delete_link_data(id) {
    return service({
        url: 'adminHome/link/' + id + '/',
        method: 'delete',
    })
}

export function update_link_data(id, data) {
    return service({
        url: 'adminHome/link/' + id + '/',
        method: 'put',
        data: data
    })
}

export function create_link_data(data){
    return service({
        url: 'adminHome/links/',
        method: 'post',
        data: data
    })
}