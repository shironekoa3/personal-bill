import request from '../utils/request'

export function list(param) {
    return request.post('/bill/list', param);
}
export function add(params) {
    return request.post('/bill/add', params);
}
export function del(params) {
    return request.get(`/bill/delete/${params}`);
}
export function getUploadURL() {
    let env = import.meta.env.VITE_APP_ENV
    if (env === 'production') {
        return location.origin + '/bill/upload';
    } else if (env === 'development') {
        return request.defaults.baseURL + '/bill/upload';
    }
}
export function importByKey(params) {
    return request.post(`/bill/importByKey?${params}`);
}
export function cancelImportByKey(params) {
    return request.post(`/bill/cancelImportByKey?${params}`);
}
