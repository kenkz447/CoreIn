
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'


import { GoogleMap } from '../../shared/components'
import { Container, Row, Col } from 'reactstrap'
import { PageItem, Image, Pagination, SideBarToggleStart } from '../../shared/components'

import { default as classNames } from 'classnames'
import { renderItem } from '../helper/render-items'

const pageConfigure = require('../configuration.js')

const getCurrentCategory = require('../helper/get-current-category.js')

const { fetchEntities, getCategoryByNameFromCatogires, generateEntityDetailUrl } = require('../../shared/utilities')

class BigMap extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.updateViewProps(props)
        this.onMarkerClick = this.onMarkerClick.bind(this)
        this.renderMarkerContent = this.renderMarkerContent.bind(this)
        this.onMarkerCloseBtnClick = this.onMarkerCloseBtnClick.bind(this)
    }

    componentWillMount() {
        this.updateViewProps(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
            this.updateViewProps(nextProps)
        }
    }

    componentDidMount() {
        const { layouttParameters: { mediaSize, viewportHeight, headerHeight } } = this.props
        const $bigMap = $('#big-map')

        if (mediaSize == 'md' || mediaSize == 'sm' || mediaSize == 'xs') {
            const bigMapHeight = viewportHeight - headerHeight
            $bigMap.find('.g-map').css('height', `${bigMapHeight}px`)
        }
        else {
            var $parentBigMap = $bigMap.parent()
            const bigMapHeight = $parentBigMap.innerHeight()
            $bigMap.find('.g-map').css('height', `${bigMapHeight}px`)
        }
    }

    setStateRandomProject(randomItems) {
        const { getItemsWithPath } = this.props
        const itemWithPath = generateEntityDetailUrl(randomItems, `/${pageConfigure.page}/${pageConfigure.detailPath}`)
        this.setState({ randomItems: itemWithPath })
    }

    //request 9 dự án ngẫu nhiên
    componentWillMount() {
        $.ajax({
            url: '/project/getrandomEntity',
            data: { count: 9 },
            success: this.setStateRandomProject.bind(this)
        });
    }

    updateViewProps(props) {
        const { categories, match: { params: { category, page } }, onDataFetch, setMapMarkers, searchArea, searchCity } = props
        const currentCategory = getCategoryByNameFromCatogires(category, categories)

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
            categories: currentCategory.id && { [ pageConfigure.TAXONOMY_TYPE_ID_CATEGORY ]: currentCategory.id },
            entityTypeId: pageConfigure.ENTITY_TYPE_ID,
            additionalFields: [ 'mapLongitude', 'mapLatitude' ],
            filtering
        }
        const baseItemPath = `/${pageConfigure.page}/${pageConfigure.detailPage}`

        fetchEntities(pageConfigure.mvcController, postParams, baseItemPath, (items, totalPages) => {
            items = generateEntityDetailUrl(items, `/${pageConfigure.page}${pageConfigure.detailPath}`)
            onDataFetch({ items, totalPages }, 0)

            const markers = items.map(({ id, name, thumbnailUrl, moreDetails: { mapLongitude, mapLatitude }, title, path }) => {
                return {
                    id,
                    lat: mapLatitude,
                    lng: mapLongitude,
                    title,
                    thumbnailUrl,
                    redirect: path,
                    height: 280,
                }
            })
            setMapMarkers(pageConfigure.smallMapId, markers)
        })
    }

    onMarkerClick(marker) {
        const { layouttParameters: { mediaSize } } = this.props
        if (mediaSize == 'md' || mediaSize == 'sm' || mediaSize == 'xs')
            this.setState({ showBalloonForMarker: marker.id })
        else
            this.props.dispatch(push(marker.redirect))
    }

    onMarkerCloseBtnClick() {
        this.setState({ showBalloonForMarker: -1 })
    }

    renderMarkerContent(marker) {
        return (
            <div className="marker-balloon">
                <div className="marker-balloon-close" onClick={ this.onMarkerCloseBtnClick }
                >
                    <span className="marker-balloon-close-icon">X</span>
                </div>
                <div className="marker-thumbnail mb-3">
                    <Image className="h-100" url={ marker.thumbnailUrl } description={ `${marker.title} thumbnail` } />
                </div>
                <div className="marker-info mb-2">
                    <label className="marker-label">
                        { marker.title || `Missing Title` }
                    </label>
                    <br />
                    <a className={ classNames('map-marker-hint__ap-link') }>
                        { localizationString.getString("Click to view more info") }
                    </a>
                </div>
            </div>
        )
    }

    render() {
        const { map } = this.props

        return (
            <div id="big-map" className="big-map-container ">
                <div className="g-map g-map-big">
                    <GoogleMap {...map}
                        renderMarkerContent={ this.renderMarkerContent }
                        showBalloonForMarker={ this.state.showBalloonForMarker }
                        onMarkerClick={ this.onMarkerClick } />
                    <SideBarToggleStart className="float static" />
                </div>
                <div className="page-titles mt-4 mb-3">
                    <span className="page-title">{ localizationString.getString("Dự án") }</span>
                    <span>|</span>
                    <span className="page-title">{ localizationString.getString("Công trình khác") }</span>
                </div>

                <Pagination items={ this.state.randomItems } className="w-100 pl-2 pl-lg-0 pr-2 pr-lg-0"
                    layout={ [
                        { xs: 6, sm: 6, md: 4, lg: 4, xl: 4 },
                        { at: 3, xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }
                    ] }
                    itemWrapperClassName="page-item"
                    itemPerPage={ 3 }
                    renderItem={ renderItem } />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { totalPages, items, categories, pageContent, searchArea, searchCity } = state.connectedBasePage.pages[ pageConfigure.page ]
    const { mediaSize, viewportHeight, header } = state.layout.parameters
    return {
        totalPages,
        items,
        categories,
        pageContent,
        searchArea, searchCity,
        map: state.googleMap[ pageConfigure.smallMapId ],
        layouttParameters: { mediaSize, viewportHeight, headerHeight: header.height }
    }
}

export default connect(mapStateToProps)(BigMap);