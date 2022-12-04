import service from './index.js'

export function get_message_all() {
    return service({
        url: 'adminHome/articlesMessages/',
        method: 'get',
    })
}

export function delete_message_all(id) {
    return service({
        url: 'adminHome/articlesMessage/' + id +'/',
        method: 'delete',
    })
}

export function get_message_page(page) {
    return service({
        url: 'adminHome/articlesMessages/?page=' + page,
        method: 'get',
    })
}