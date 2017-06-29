import React, { Component } from 'react'
import { connect } from 'react-redux'
//Components
import { Container, Row, Col } from 'reactstrap'
import { Image, Pagination, SideBarToggleStart } from '../../shared/components'

//Helper functions
import { renderItem } from '../helper/render-items'
const { fetchEntities, getCategoryByNameFromCatogires, generateEntityDetailUrl } = require('../../shared/utilities')

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
        this.onItemHover = this.onItemHover.bind(this)
    }

    updateViewProps(props) {
        const { categories, match: { params: { category, page } }, onDataFetch, setMapMarkers, searchArea, searchCity } = props
        const currentCategory = getCategoryByNameFromCatogires(category, categories)
        const currentPage = page || props.defaultPage

        var filtering = []
        if (searchArea)
            filtering.push(
                {
                    id: 'area',
                    value: searchArea.from,
                    operator: '>='
                },
                {
                    id: 'area',
                    value: searchArea.to,
                    operator: '<='
                }
            )

        if (searchCity)
            filtering.push({
                id: 'city',
                value: searchCity,
                operator: '=='
            })

        const postParams = {
            page: currentPage,
            pageSize: pageConfigure.ITEM_PER_PAGE,
            categories: currentCategory.id && { [ pageConfigure.TAXONOMY_TYPE_ID_CATEGORY ]: currentCategory.id },
            entityTypeId: pageConfigure.ENTITY_TYPE_ID,
            additionalFields: [ 'mapLongitude', 'mapLatitude' ],
            filtering
        }
        const baseItemPath = `/${pageConfigure.page}/${pageConfigure.detailPage}`

        fetchEntities(pageConfigure.mvcController, postParams, baseItemPath, (items, totalPages) => {
            items = generateEntityDetailUrl(items, `/${pageConfigure.page}/${pageConfigure.detailPath}`)
            onDataFetch({ items, totalPages }, 0)

            const markers = items.map(({ id, name, thumbnailUrl, moreDetails: { mapLongitude, mapLatitude }, title, path }) => {
                return {
                    id,
                    lat: mapLatitude,
                    lng: mapLongitude,
                    title,
                    thumbnailUrl: `/${thumbnailUrl}`,
                    redirect: path,
                    height: 48,
                }
            })
            setMapMarkers(pageConfigure.smallMapId, markers)
        })
    }

    componentWillMount() {
        this.updateViewProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
            this.updateViewProps(nextProps)
        }
    }

    onItemHover(isHover, item) {
        const { showMarkerBalloon } = this.props
        var markerId = isHover ? item.id : null

        showMarkerBalloon(pageConfigure.smallMapId, markerId)
    }

    render() {
        const { match, pageContent: { thumbnail, title }, categories, items, totalPages, defaultPage } = this.props

        const currentCategory = getCategoryByNameFromCatogires(match.params.category, categories)
        const currentPage = match.params.page ? parseInt(match.params.page) : defaultPage

        return (
            <Row>
                <Image className="h-100" {...thumbnail} />
                <SideBarToggleStart className=" mt-4 mb-3">
                    <h1 className="page-titles">
                        <span className="page-title">{ title }</span>
                        <span>|</span>
                        <span className="page-title">{ currentCategory && currentCategory.title }</span>
                    </h1>
                </SideBarToggleStart>
                {
                    currentCategory && (
                        <Pagination itemWrapperClassName="page-item" className="w-100 pl-2 pl-lg-0 pr-2 pr-lg-0"
                            layout={ { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 } }
                            items={ items }
                            totalPages={ totalPages }
                            currentPage={ currentPage }
                            templatePath={ String(match.path).replace(':category', currentCategory.name) }
                            renderItem={ renderItem }
                            onItemHover={ this.onItemHover }
                        />
                    )
                }
            </Row>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { totalPages, items, categories, pageContent, searchArea, searchCity } = state.connectedBasePage.pages[ pageConfigure.page ]
    return {
        totalPages,
        items,
        categories,
        pageContent,
        searchArea, searchCity
    }
}

export default connect(mapStateToProps)(DefaultView)