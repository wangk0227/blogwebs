import service from './index'

// 首页显示内容

export function get_blogger_content() {
    return service({
        url: 'blogsHome/blogger_content/',
        method: 'get',
    })
}

export function get_category() {
    return service({
        url: 'blogsHome/category/',
        method: 'get',
    })
}

export function get_recent_article() {
    return service({
        url: 'blogsHome/recentArticle/',
        method: 'get',
    })
}

export function get_links() {
    return service({
        url: 'blogsHome/links/',
        method: 'get',
    })
}

export function get_article() {
    return service({
        url: 'blogsHome/article/',
        method: 'get',
    })
}

export function get_category_article(article_id) {
    return service({
        url: 'blogsHome/article/?category_id=' + article_id,
        method: 'get',
    })
}

export function get_article_page(page) {
    return service({
        url: 'blogsHome/article/?page=' + page,
        method: 'get',
    })
}

export function get_article_search(search) {
    return service({
        url: 'blogsHome/search/?search=' + search,
        method: 'get',
    })
}

export function get_article_search_page(search, page) {
    return service({
        url: 'blogsHome/search/?search=' + search + '&page=' + page,
        method: 'get',
    })
}
export function get_article_content(id) {
    return service({
        url: 'blogsHome/articlecContent/' + id + '/',
        method: 'get',
    })
}