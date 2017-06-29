const dataRequest = require('./requestData')
/**
 * Gắn property 'path' cho mỗi item trong list
 * @param {Array} items 
 * @param {String} basePath 
 */
function getItemsWithPath(items, basePath) {
    const itemsWithPath = items.map((item) => {
        item.path = `${basePath}/${item.name}`
        return item
    })
    return itemsWithPath
}

/**
 * @param {String} mvcControllerUrl
 * @param {Object} postParams Các params sẽ được gởi đi, bao gồm PageSize, Page, Filtering, Sorted, Categories({CategoryType: CategoryId}), EntityTypeId, AdditionalFields
 * @param {String} baseItemPath Url đặt phía trước sẽ nối với 'entity name' để dẫn đến trang chi tiết, ví dụ '/thu-vien/chi-tiet/:entity-name'
 * @param {Func} callBack Sẽ có 2 giá trị được truyền vào bao gồm entities(entities của trang hiện tại với property 'path' được gán cho mỗi entity), totalPages(tổng số trang trước khi skip-take)
 */
export function fetchEntities(mvcControllerUrl, postParams, baseItemPath, callBack) {
    const { page, pageSize, filtering, sorted, categories, entityTypeId, additionalFields } = postParams

    dataRequest(global.APP_DOMAIN + mvcControllerUrl + "/GetTableData", pageSize, page, sorted, filtering, categories, entityTypeId, additionalFields,
        (response) => {
            const { entities, totalCount } = response
            const itemsWithPath = getItemsWithPath(entities, baseItemPath)
            const totalPages = Math.ceil(totalCount / pageSize)
            callBack(itemsWithPath, totalPages)
        })
} 
