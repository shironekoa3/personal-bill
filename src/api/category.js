import request from '../utils/request'

export function list(param) {
    return request.get(`/category/list?searchKey=${param?.searchKey || ''}`);
}
export function add(params) {
    return request.post('/category/add', params);
}
export function del(params) {
    return request.get(`/category/delete/${params}`);
}