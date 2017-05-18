const $ = require('jquery');
const listToTree = require('list-to-tree');
const CheckBox = require('./checkbox');
const { Field } = require('redux-form');

class CheckboxList extends React.Component {
    constructor(props) {
        super();
        this.renderNode = this.renderNode.bind(this);
    }


    renderNode(node) {
        const {taxonomyName} = this.props;
        const name = `${taxonomyName}.${node.id}`

        return (
            <div key={node.id} className="item">
                <Field component={CheckBox} display={{ title: node.title }} name={name} />
                {node.children &&
                    <div className="children">
                        {
                            $.map(node.children, (node) => {
                                return this.renderNode(node);
                            })
                        }
                    </div>
                }
            </div>
        );
    }

    render() {
        const { taxonomies, taxonomyName, title } = this.props;

        const ltt = new listToTree(taxonomies, {
            key_id: 'id',
            key_parent: 'parentId',
            key_child: 'children'
        });

        const tree = ltt.GetTree();

        return (
            <div className="checkbox-list">
                <h4>{title}</h4>
                {tree &&
                    <div className="items">
                        {
                            $.map(tree, (node) => {
                                return this.renderNode(node);
                            })
                        }
                    </div>
                }
            </div>);
    };
};

module.exports = CheckboxList;