const keys = require('./keys');

const loadTaxonomyTypes = (taxonomyTypes) => ({
    type: keys.loadTaxonomyTypes,
    taxonomyTypes
});

const entityTypeChange = (entityType) => ({
    type: keys.entityTypeChange,
    entityType
});

const taxonomyTypeChange = (taxonomyType) => ({
    type: keys.taxonomyTypeChange,
    taxonomyType
});

const newTaxonomyFormChange = () => ({
    type: keys.newTaxonomyFormChange,
});

const loadTaxonomies = (taxonomies) => ({
    type: keys.loadTaxonomies,
    taxonomies
});

const newTaxonomy = (taxonomy) => ({
    type: keys.newTaxonomy,
    taxonomy
}); 

const taxonomyClick = (taxonomy) => ({
    type: keys.taxonomyClick,
    taxonomy
});

const taxonomiesDeleted = (deleteResult) => ({
    type: keys.taxonomiesDeleted,
    deleteResult
});

const taxonomySelect = (taxonomy) => ({
    type: keys.taxonomySelect,
    taxonomy
});

const taxonomiesUpdating = () => ({
    type: keys.taxonomiesUpdating,
});

const taxonomiesUpdated = (updateResult) => ({
    type: keys.taxonomiesUpdated,
    updateResult
});

const taxonomyUpdated = (updateResult) => ({
    type: keys.taxonomyUpdated,
    updateResult
});

const componentLoaded = (componentName) => ({
    type: keys.componentLoaded,
    componentName
});

module.exports = {
    loadTaxonomyTypes,
    entityTypeChange,
    taxonomyTypeChange,
    newTaxonomyFormChange,
    loadTaxonomies,
    newTaxonomy,
    taxonomyClick,
    taxonomiesDeleted,
    taxonomySelect,
    taxonomiesUpdating,
    taxonomiesUpdated,
    taxonomyUpdated,
    componentLoaded
};