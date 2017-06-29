function createCategoryUrlFromRoutePathAndCategoryName(routePath, categoryName, categoryParamKeyWithColon = ':category') {
    return String(routePath).replace(categoryParamKeyWithColon, categoryName)
}

export default createCategoryUrlFromRoutePathAndCategoryName