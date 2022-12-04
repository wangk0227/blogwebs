// 站内信息接口
import service from './index.js'

export function get_blogger_content_all() {
    return service({
        url: 'adminHome/blogger/contents/',
        method: 'get',
    })
}

export function get_blogger_content_page(page) {
    return service({
        url: 'adminHome/blogger/contents/?page=' + page,
        method: 'get',
    })
}

export function delete_blogger_content(id) {
    return service({
        url: 'adminHome/blogger/content/' + id + '/',
        method: 'delete',
    })
}
// 表结构已经修改 需要重新更改站点信息

export function get_blogger_content(id) {
    return service({
        url: 'adminHome/blogger/content/' + id + '/',
        method: 'get',
    })
}

export function update_blogger_content(id,data) {
    return service({
        url: 'adminHome/blogger/content/' + id + '/',
        method: 'put',
        data:data,
    })
}

export function create_blogger_content(data) {
    return service({
        url: 'adminHome/blogger/contents/',
        method: 'post',
        data:data,
    })
}