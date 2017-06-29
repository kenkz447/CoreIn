import dataRequest from './utilities/requestData'
import { fetchEntities } from './utilities/fetchEntities'
import { default as StyleSheet } from './utilities/sheets'
import { getOptions, getOption } from './utilities/getOptions'
import { default as getCategoryByNameFromCatogires } from './utilities/getCurrentCategory'
import { default as createCategoryUrlFromRoutePathAndCategoryName } from './utilities/createCategoryUrl'
import { default as generateEntityDetailUrl } from './utilities/generateEntityDetailUrl'
import { treeToList } from './utilities/treeToList'
import { fetchSingleEntity, fetchPage } from './utilities/fetchSingleEntity'
import {default as fetchTaxonomiesByTaxonomyTypeId } from './utilities/fetchTaxonomies'

export {
    dataRequest,
    fetchEntities,
    StyleSheet, 
    getOptions, getOption,
    getCategoryByNameFromCatogires,
    createCategoryUrlFromRoutePathAndCategoryName,
    treeToList,
    generateEntityDetailUrl,
    fetchSingleEntity, fetchPage,
    fetchTaxonomiesByTaxonomyTypeId
}