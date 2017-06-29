import React, { Component } from 'react'
import { connect } from 'react-redux'
//Components
import { Container, Row, Col } from 'reactstrap'
import { Image, Pagination, SideBarToggleStart } from '../../shared/components'

//Helper functions
import { renderItem } from '../helper/render-items'
const { fetchEntities, getCategoryByNameFromCatogires } = require('../../shared/utilities')

const pageConfigure = require('../configuration.js')

class DefaultView extends Component {
    static defaultProps = {
        defaultPage: 1,
        categories: [],
        pageContent: {
            thumbnail: {}
        }
    }

    constructor(props) {
        super(props);
        this.updateViewProps = this.updateViewProps.bind(this)
    }

    updateViewProps(props) {
        const { categories, match: { params: { category, page } }, onDataFetch } = props
        const currentCategory = getCategoryByNameFromCatogires(category, categories)
        const currentPage = page || props.defaultPage

        const postParams = {
            page: currentPage,
            pageSize: pageConfigure.ITEM_PER_PAGE,
            categories: currentCategory.id && { [ pageConfigure.TAXONOMY_TYPE_ID_CATEGORY ]: currentCategory.id },
            entityTypeId: pageConfigure.ENTITY_TYPE_ID,
            additionalFields: [ 'excerpt' ]
        }
        const baseItemPath = `/${pageConfigure.page}/${pageConfigure.detailPage}`

        fetchEntities(pageConfigure.mvcController, postParams, baseItemPath, (items, totalPages) => {
            onDataFetch({ items, totalPages }, 0)
        })
    }

    componentWillMount() {
        this.updateViewProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.match) != JSON.stringify(this.props.match) ||
            JSON.stringify(nextProps.categories) != JSON.stringify(this.props.categories)) {
            this.updateViewProps(nextProps)
        }
    }

    render() {
        const { match, pageContent: { thumbnail, title }, categories, items, totalPages, defaultPage } = this.props

        const currentCategory = getCategoryByNameFromCatogires(match.params.category, categories)
        const currentPage = match.params.page ? parseInt(match.params.page) : defaultPage

        return (
            <Row>
                <Image className="h-100" {...thumbnail} />
                <SideBarToggleStart className="mt-4 mb-3">
                    <h1 className="page-titles">
                        <span className="page-title">{ title }</span>
                        <span>|</span>
                        <span className="page-title">{ currentCategory && currentCategory.title }</span>
                    </h1>
                </SideBarToggleStart>

                {
                    currentCategory && (
                        <Pagination itemWrapperClassName="page-item" className="w-100 pl-2 pl-lg-0 pr-2 pr-lg-0"
                            layout={ { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 } }
                            items={ items }
                            totalPages={ totalPages }
                            currentPage={ currentPage }
                            templatePath={ String(match.path).replace(':category', currentCategory.name) }
                            renderItem={ renderItem }
                        />
                    )
                }
            </Row>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { totalPages, items, categories, pageContent } = state.connectedBasePage.pages[ pageConfigure.page ]
    return {
        totalPages,
        items,
        categories,
        pageContent
    }
}

export default connect(mapStateToProps)(DefaultView)