const $ = require('jquery');

const getTaxonomyTypes = (handler) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyTypes",
        type: "GET",
        success: handler
    });
};

const getNewTaxonomyForm = (handler, taxonomyTypeId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyForm",
        data: { taxonomyTypeId },
        type: "GET",
        success: handler
    });
};

const getTaxonomies = (handler, taxonomyTypeId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomies",
        data: { taxonomyTypeId },
        type: "GET",
        success: handler
    });
};

const deleteTaxonomies = (handler, taxonomyIds) => {
    $.ajax({
        url: "/taxonomyui/DeleteTaxonomies",
        data: { taxonomyIds },
        method: 'DELETE',
        success: (result) => {
            handler(result);
        }
    });
};

const updateTaxonomies = (handler, taxonomies) => {
    $.ajax({
        url: "/taxonomyui/UpdateTaxonomyTree",
        data: { viewModels: taxonomies },
        method: 'PUT',
        success: handler
    });
};

const getTaxonomyFormFor = (handler, taxonomyId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyFormFor",
        data: { taxonomyId},
        success: handler
    });
};

module.exports = { getTaxonomyTypes, getNewTaxonomyForm, getTaxonomies, deleteTaxonomies, updateTaxonomies, getTaxonomyFormFor };