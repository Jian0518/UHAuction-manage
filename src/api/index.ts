import { get, getBaseURL, post } from './request'

const HttpManager = {

    attachImageUrl: (url) => `${getBaseURL()}/${url}`,

    getLoginStatus: (adminRequest) => post(`admin/login`, adminRequest),

    updateItem: (item) => post(`item/admin/update`, item),

    updateFund: (fund) => post(`item/fund/update`, fund),
    
    addFund: (fund) => post(`item/fund/add`,fund),

    getAllUser: () => get(`ums/user`),

    getAllBids: () => get(`bid/all`),

    getAllItem: () => get(`item/all`),

    getAllFund: () => get(`item/fund/all`),

    getCategory: () => get(`category/list`),

    getUserOfId: (id) => get(`user/detail?id=${id}`),

    deleteUser: (id) => get(`ums/user/delete?id=${id}`),
  
    getCommentByItemId: (id) => get(`comment/all?id=${id}`),

    getImagesByItemId: (id) => get(`item/images?id=${id}`),

    deleteComment: (id) => get(`comment/delete?id=${id}`),

    deleteImage: (id) => get(`item/image/delete?id=${id}`),

    deleteItem: (id) => get(`item/admin/delete?id=${id}`),

    deleteFund: (id) => get(`item/fund/delete?id=${id}`),

    

}

export { HttpManager }
