import service from './index.js'



export function get_category_all (){
    return service({
        url:'adminHome/categorys/',
        method:'get',
    })
}

export function delete_category_data(id){
    return service({
        url:'adminHome/category/' + id + '/',
        method:'delete',
    })
}

export function update_category_data(id,data){
    return service({
        url:'adminHome/category/' + id + '/',
        method:'put',
        data:data,
    })
}
export function get_category_data_page(page) {
    return service({
        url: 'adminHome/categorys/?page=' + page,
        method: 'get',
    })
}
export function create_category_data(data){
    return service({
        url: 'adminHome/categorys/',
        method: 'post',
        data: data
    })
}
