import listToTree from 'list-to-tree'
import { Collapse } from 'reactstrap'
import classNames from 'classnames'

class CategoryMenu extends React.Component {
    constructor(props) {
        super(props)

        const { categories, openListByDefault } = props

        const tree = new listToTree(categories, { key_parent: 'parentId', key_child: 'children' }).GetTree()

        var collapse = {}

        for(var index in categories){
            collapse[categories[index].name] = openListByDefault
        }

        this.state = {
            collapse,
            tree
        }

        this.renderCategories = this.renderCategories.bind(this)
        this.renderCategory = this.renderCategory.bind(this)
    }

    renderCategories(categoryItems) {
        return (
            <ul className="category-menu-dropdown">
                {
                    categoryItems.map((categoryItem, index) => {
                        return this.renderCategory(categoryItem)
                    })
                }
            </ul>
        )
    }

    renderCategory({ title, id, name, children }, className) {
        const { onDataFetch, currentCategory } = this.props

        return (
            <li id={ id && `category-${id}` } data-name={ name } className={classNames("category-menu-item", className, {'current': currentCategory && currentCategory.id === id })} >
                <a href="#" className="all category-menu-item-link" onClick={ (e) => { 
                    e.preventDefault();
                    onDataFetch({currentCategory: { title, id, name }}, 0) } }>
                    { title }
                </a>
                {
                                        children && (
                        <span className="chevron" onClick={() => { this.toogle(name) }}>
                            <i className="fa fa-angle-down" aria-hidden="true" />
                        </span>
                    )
                }
                {
                    children && (
                        <Collapse isOpen={ this.state.collapse[ name ] }>
                            {this.renderCategories(children)}
                        </Collapse>
                    )
                }
            </li>
        )
    }

    toogle(name) {
        const { collapse } = this.state;
        this.setState({collapse: $.extend(true, {}, collapse, {[name]: !collapse[name]})})
    }

    render() {
        const  {currentCategory} = this.props;
        const { tree } = this.state;
        return (
            <section className="category-menu">
                <ul className="category-menu-list d-none d-lg-block">
                    { this.renderCategory({ title: localizationString.getString('Tất cả') }, !currentCategory && 'current') }
                    {
                        tree && tree.map((item) => {
                                return this.renderCategory(item)
                        })
                    }
                </ul>
            </section>
        )
    }
}

CategoryMenu.defaultProps = {
    categories: [],
    openListByDefault: true
}

export default CategoryMenu