const _ = require('underscore');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const classnames = require('classnames');
const Tree = require('react-ui-tree');
const ajaxs = require('../redux/tu-ajaxs');
const { loadTaxonomies, taxonomyClick, taxonomySelect, taxonomiesDeleted, taxonomiesUpdating, taxonomiesUpdated } = require('../redux/tu-actions');
const listToTree = require('list-to-tree');
const { Button, ButtonGroup } = require('reactstrap');

class TaxonomyTree extends React.Component {
    constructor(props) {
        super();
        this.loaded = false;

        this.convertTreeToList = this.convertTreeToList.bind(this);
        this.onTaxonomyUpdate = this.onTaxonomyUpdate.bind(this);
    }

    visitNode(node, hashMap, array) {
        if (!hashMap[node.id]) {
            hashMap[node.id] = true;
            array.push(node);
        }
    }

    convertTreeToList(root) {
        var stack = [], array = [], hashMap = {};
        stack.push(root);

        var currentParent = root;
        while (stack.length !== 0) {
            var node = stack.pop();
            var notRoot = node.id && true;

            if (!node.children) {
                this.visitNode(node, hashMap, array);
            } else {
                if (notRoot)
                    array.push(node);
                for (var i = node.children.length - 1; i >= 0; i--) {
                    node.children[i].parentId = node.id
                    stack.push(node.children[i]);
                }
            }
        }

        return array;
    }

    renderNode(node) {
        const { currentTaxonomy, taxonomyClick, taxonomySelect, selectedTaxonomies} = this.props;
        var isActive = (currentTaxonomy && (node.id === currentTaxonomy.id));
        var isChecked = _.findWhere(selectedTaxonomies, { id: node.id }) && true;
        return (
            <div className={classnames('node', { 'active': isActive })} onClick={() => {
                global.selectedTaxonomyId = node.id;
                taxonomyClick(node.id && node);
            }}>
                {node.id && <input type="checkbox" checked={isChecked} onClick={() =>
                {
                    taxonomySelect(node.id && node);
                }} />}
                <span>
                    {node.title}
                </span>
            </div>
        );
    }

    onTaxonomyUpdate() {
        const { taxonomies, taxonomiesUpdating, taxonomiesUpdated } = this.props;
        taxonomiesUpdating();
        ajaxs.updateTaxonomies(taxonomiesUpdated, taxonomies);
    }

    render() {
        const {taxonomies, currentTaxonomyType, loadTaxonomies, taxonomiesChanged, taxonomiesDeleted, selectedTaxonomies, isTaxonomiesUpdating } = this.props;

        if (!currentTaxonomyType)
            return null;

        if (taxonomies.length === 0) {
            ajaxs.getTaxonomies((taxonomiesResult) => {
                loadTaxonomies(taxonomiesResult);
            }, currentTaxonomyType.id)
            this.loaded = true;
            return null;
        }

        const ltt = new listToTree(taxonomies, {
            key_id: 'id',
            key_parent: 'parentId',
            key_child: 'children'
        });

        const taxonomyTree = { title: currentTaxonomyType.title, children: ltt.GetTree() };

        return (
            <div className="card">
                <div className="card-block">
                    <ButtonGroup>
                        <Button type="button" disabled={isTaxonomiesUpdating} onClick={this.onTaxonomyUpdate}>Update</Button>
                        <Button type="button" disabled={selectedTaxonomies.length === 0} onClick={() => { ajaxs.deleteTaxonomies(taxonomiesDeleted, selectedTaxonomies.map((taxonomy) => (taxonomy.id))) }}>Delete</Button>
                    </ButtonGroup>
                    <hr />
                    <Tree
                        paddingLeft={20}
                        tree={taxonomyTree}
                        onChange={(root) => {
                            loadTaxonomies(this.convertTreeToList(root));
                        }}
                        renderNode={this.renderNode.bind(this)}
                    />
                </div>
            </div>
        );
    };
};

const stateToProps = (state) => ({
    currentTaxonomy: state.tu.current.taxonomy,
    currentTaxonomyType: state.tu.current.taxonomyType,
    taxonomies: state.tu.current.taxonomies,
    selectedTaxonomies: state.tu.selectedTaxonomies,
    isTaxonomiesUpdating: state.tu.isTaxonomiesUpdating
});

const reducerToProps = (reducer) => (
    bindActionCreators({
        loadTaxonomies,
        taxonomyClick,
        taxonomySelect,
        taxonomiesDeleted,
        taxonomiesUpdating,
        taxonomiesUpdated
    }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(TaxonomyTree);


