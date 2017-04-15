const $ = require('jquery');
const _ = require('underscore');
const ajaxs = require('../redux/tu-ajaxs');
const { loadTaxonomyTypes, loadTaxonomies, entityTypeChange, taxonomyTypeChange } = require('../redux/tu-actions');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { ListGroup, ListGroupItem, Label, Collapse, Card, CardBlock } = require('reactstrap');

_.groupByMulti = function (obj, values, context) {
    if (!values.length)
        return obj;
    var byFirst = _.groupBy(obj, values[0], context),
        rest = values.slice(1);
    for (var prop in byFirst) {
        byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
    }
    return byFirst;
};

const EntityTypeList = (props) => {
    const {loadTaxonomyTypes, loadTaxonomies, currentEntityType, currentTaxonomyType, taxonomyTypes, entityTypeChange, taxonomyTypeChange} = props;

    if (taxonomyTypes.length === 0) {
        ajaxs.getTaxonomyTypes((taxonomyTypeResult) => {
            loadTaxonomyTypes(taxonomyTypeResult);
        });
        return null;
    }

    const entityTypeGroups = _.groupByMulti(taxonomyTypes, ['entityTypeGroup', 'entityType'], null);

    return (
        <div className="entity-type-groups">
            {entityTypeGroups &&
                $.map(entityTypeGroups, (entityTypeGroup,index) => {
                    return (
                        <div key={index} className="entity-type-group mb-1">
                            <Label><strong>{index}</strong></Label>
                            <ListGroup>
                                {
                                    $.map(entityTypeGroup, (entityTypes, index) => {
                                        const entityTypeName = index;
                                        const isActive = (entityTypeName === currentEntityType);
                                        return (
                                            <div key={index}>
                                                <ListGroupItem action tag="button" onClick={() => { entityTypeChange(entityTypeName) }}>{entityTypeName}</ListGroupItem>
                                                {
                                                    <Collapse isOpen={isActive}>
                                                        <ListGroup>
                                                            {
                                                                entityTypes.map((taxonomyType) => {
                                                                    const isCurrentTaxType = (currentTaxonomyType && currentTaxonomyType.name === taxonomyType.name);
                                                                    return (
                                                                        <ListGroupItem key={taxonomyType.name} active={isCurrentTaxType} action tag="button"
                                                                            onClick={() => {
                                                                                taxonomyTypeChange(taxonomyType);
                                                                            }}>
                                                                            <i className="fa fa-caret-right ml-1 mr-1" aria-hidden="true"></i>
                                                                            {taxonomyType.title}
                                                                        </ListGroupItem>
                                                                    );
                                                                })
                                                            }
                                                        </ListGroup>
                                                    </Collapse>
                                                }
                                            </div>);
                                    })
                                }
                            </ListGroup>
                        </div>
                    );

                })}
        </div>
    );
};

const stateToProps = (state) => ({
    taxonomyTypes: state.tu.taxonomyTypes,
    currentEntityType: state.tu.current.entityType,
    currentTaxonomyType: state.tu.current.taxonomyType
});

const reducerToProps = (reducer) => (
    bindActionCreators({ loadTaxonomyTypes, loadTaxonomies, entityTypeChange, taxonomyTypeChange }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(EntityTypeList);


