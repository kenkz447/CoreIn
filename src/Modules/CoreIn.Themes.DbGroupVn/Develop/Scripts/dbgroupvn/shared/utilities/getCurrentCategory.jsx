
import { treeToList } from './treeToList'

function getCategoryByNameFromCatogires(categoryName, categories) {
    const flatCategoryArray = treeToList(categories, 'name')

    const currentCategory = flatCategoryArray.filter((categoryItem) => {
        return categoryItem.name === categoryName
    })[ 0 ]
    return currentCategory
}

export default getCategoryByNameFromCatogires