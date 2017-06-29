import jQuery from 'jquery';
import { default as listToTree } from 'list-to-tree'
import { default as createCategoryUrlFromRoutePathAndCategoryName } from './createCategoryUrl'

const TAXONOMY_CONTROLLER = '/TaxonomyUI'
const GET_TAXONOMIES_ACTION = '/GetTaxonomies'

function fetchTaxonomiesByTaxonomyType(taxonomyTypeId) {
    return new Promise((executor, reject) => {
        const requestUrl = `${TAXONOMY_CONTROLLER}${GET_TAXONOMIES_ACTION}`
        
        $.ajax({
            url: requestUrl,
            data: { taxonomyTypeId },
            method: "GET",
            success: (responseFlatCategoryArray) => {
                const ltt = new listToTree(responseFlatCategoryArray, { key_parent: 'parentId', key_child: 'children' })
                const categories = ltt.GetTree()

                categories.unshift({
                    name: localizationString.getString('tat-ca'),
                    title: localizationString.getString("Tất cả"),
                })
                executor(categories)
            }
        })
    })
}

export default fetchTaxonomiesByTaxonomyType