import service from './index.js'


export function get_articles_all() {
    return service({
        url: 'adminHome/articles/',
        method: 'get',
    })
}
export function create_articles(data) {
    return service({
        url: 'adminHome/articles/',
        method: 'post',
        data:data
    })
}
export function get_data_page(page) {
    return service({
        url: 'adminHome/articles/?page=' + page,
        method: 'get',
    })
}
export function delete_articles(id) {
    return service({
        url: 'adminHome/article/' + id + '/',
        method: 'delete',
    })
}

export function get_articles(id) {
    return service({
        url: 'adminHome/article/' + id + '/',
        method: 'get',

    })
}
export function update_articles(id,data) {
    return service({
        url: 'adminHome/article/' + id + '/',
        method: 'put',
        data:data,
    })
}

