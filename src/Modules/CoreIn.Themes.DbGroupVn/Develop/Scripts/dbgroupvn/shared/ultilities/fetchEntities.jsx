const dataRequest = require('./requestData')

function getItemsWithPath(items, basePath) {
    const itemsWithPath = items.map((item) => {
        item.path = `${basePath}/${item.name}`
        return item
    })
    return itemsWithPath
}

export function fetchEntities(mvcControllerUrl, postParams, baseItemPath, callBack) {
    const { page, pageSize, filtering, sorted, categories, additionalFields } = postParams

    dataRequest(mvcControllerUrl + "/GetTableData", pageSize, page, sorted, filtering, categories, additionalFields,
        (responseItems) => {
            if (responseItems.length) {
                const itemsWithPath = getItemsWithPath(responseItems, baseItemPath)
                $.get(mvcControllerUrl + '/GetTotalEntitiesCount', function (totalItem) {
                    const totalPages = Math.ceil(totalItem / pageSize)
                    callBack(itemsWithPath, totalPages)
                })
            }
        })
}
