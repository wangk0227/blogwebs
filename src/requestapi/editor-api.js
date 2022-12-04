import service from './index.js'


export function delete_editor(data){
    return service({
        url:'adminHome/editor/img/',
        method:'delete',
        data:data
    })
}