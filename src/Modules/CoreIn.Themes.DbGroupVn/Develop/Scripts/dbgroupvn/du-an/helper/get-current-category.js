module.exports = function getCurrentCategory(match, categories) {
    const currentCategory = categories.filter((categoryItem) => {
        return categoryItem.name === match.params.category
    })[0]
    return currentCategory
}