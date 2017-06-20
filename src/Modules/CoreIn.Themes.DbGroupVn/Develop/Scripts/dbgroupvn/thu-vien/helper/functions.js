function getCurrentCategory(match, categories) {
    const currentCategory = categories.filter((categoryItem) => {
        return categoryItem.name === match.params.category
    })[0]
    return currentCategory
}

function getCategoryUrl(match, categoryName, page) {
    return String(match.path).replace(':category', categoryName).replace(':page', 1)
}

module.exports = {
    getCategoryUrl,
    getCurrentCategory,
}