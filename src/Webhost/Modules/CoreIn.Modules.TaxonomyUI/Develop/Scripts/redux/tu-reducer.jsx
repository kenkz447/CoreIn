const $ = require('jquery');
const keys = require('./tu-keys');
const _ = require('underscore');

const initState = {
    taxonomyTypes: [],
    taxonomyTypeChanged: false,
    isTaxonomiesUpdating: false,
    selectedTaxonomies: [],
    current: {
        taxonomies: [],
        taxonomy: null,
        taxonomyType: null,
        entityType: ''
    }
};

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) { 
        case keys.loadTaxonomyTypes:
            newState.taxonomyTypes = action.taxonomyTypes;
            break;
        case keys.entityTypeChange:
            newState.current.entityType = action.entityType;
            break;
        case keys.taxonomyTypeChange:
            newState.taxonomyTypeChanged = true;
            newState.current.taxonomyType = action.taxonomyType;
            newState.current.taxonomies = [];
            break;
        case keys.newTaxonomyFormChange:
            newState.taxonomyTypeChanged = false;
            break;
        case keys.loadTaxonomies:
            if (action.taxonomies.length === 0)
                newState.current.taxonomies = null;
            else
                newState.current.taxonomies = action.taxonomies;
            break;
        case keys.newTaxonomy:
            if (!newState.current.taxonomies)
                newState.current.taxonomies = [];
            newState.current.taxonomies.push(action.taxonomy);
            break;
        case keys.taxonomyClick:
            newState.current.taxonomy = action.taxonomy;
            break;
        case keys.taxonomiesDeleted:
            newState.selectedTaxonomies = [];
            if (typeof action.deleteResult !== 'string')
                newState.current.taxonomies = action.deleteResult;
            break;
        case keys.taxonomySelect:
            var taxonomy = _.find(newState.selectedTaxonomies, { id: action.taxonomy.id });
            if (taxonomy)
                newState.selectedTaxonomies = _.without(newState.selectedTaxonomies, taxonomy);
            else
                newState.selectedTaxonomies.push(action.taxonomy);
            break;
        case keys.taxonomiesUpdating:
            newState.isTaxonomiesUpdating = true;
            break;
        case keys.taxonomiesUpdated:
            newState.isTaxonomiesUpdating = false;
            newState.current.taxonomies = action.updateResult.result;
            break;
        case keys.taxonomyUpdated:
            var taxonomyIndex = _.findIndex(newState.current.taxonomies, { id: action.updateResult.result.id });
            if (taxonomyIndex >= 0)
                newState.current.taxonomies[taxonomyIndex] = action.updateResult.result;
            break;
        default:
            return state;
    }
    return newState;
};

module.exports = reducer;