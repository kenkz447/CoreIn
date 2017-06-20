import React, { Component } from 'react'
import { connect } from 'react-redux'
//Components
import { Container, Row, Col } from 'reactstrap'
import { Image, Pagination } from '../../shared/components'

//Helper functions
import { renderItem } from '../helper/render-items'
const { fetchEntities } = require('../../shared/ultilities')
const { getCurrentCategory } = require('../helper/functions')

const pageConfigure = require('../configuration.js')

class DefaultView extends Component {
    static defaultProps = {
        categories: [],
        pageContent: {
            thumbnail: {}
        }
    }

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.match) != JSON.stringify(this.props.match) ||
            JSON.stringify(nextProps.categories) != JSON.stringify(this.props.categories)) {
            const { categories, match, onDataFetch } = nextProps
            const currentCategory = getCurrentCategory(match, categories)
            const currentPage = match.params.page

            const postParams = {
                page: currentPage,
                pageSize: pageConfigure.ITEM_PER_PAGE,
                categories: currentCategory.id && { [ pageConfigure.TAXONOMY_TYPE_ID_CATEGORY ]: currentCategory.id }
            }
            const baseItemPath = `${pageConfigure.page}/${pageConfigure.detailPage}`

            fetchEntities(pageConfigure.mvcController, postParams, baseItemPath, (items, totalPages) => {
                onDataFetch({ items, totalPages }, 0)
            })
        }
    }

    render() {
        const { match, pageContent: { thumbnail, title }, categories, items, totalPages } = this.props
        const currentCategory = getCurrentCategory(match, categories)
        const currentPage = parseInt(match.params.page)

        return (
            <Row>
                <Image className="h-100" {...thumbnail} />
                <div className="page-titles mt-4 mb-3">
                    <span className="page-title">{ title }</span>
                    <span>|</span>
                    <span className="page-title">{ currentCategory && currentCategory.title }</span>
                </div>
                {
                    currentCategory && (
                        <Pagination itemWrapperClassName="page-item" className="w-100"
                            items={ items }
                            totalPages={ totalPages }
                            currentPage={ currentPage }
                            getPageUrl={ (pageNumber) =>
                                String(match.path).replace(':category', currentCategory.name).replace(':page', pageNumber)
                            }

                            renderItem={ renderItem }
                            onPageChange={ this.onPageChange }
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