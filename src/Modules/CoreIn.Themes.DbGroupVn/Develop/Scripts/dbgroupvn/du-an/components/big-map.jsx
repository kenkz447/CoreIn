const pageConfigures = require('../page-configure.js')

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { GoogleMap } from '../../shared/components'
import { Container, Row, Col } from 'reactstrap'
import { PageItem, Image, Pagination } from '../../shared/components'

import { default as classNames } from 'classnames'
import { renderItem } from '../helper/render-items'

const getCurrentCategory = require('../helper/get-current-category.js')

class BigMap extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        const { searchArea, searchCity, fecthData, categories, match } = this.props
        const currentCategory = getCurrentCategory(match, categories)
        fecthData(currentCategory, searchArea, searchCity);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps)) {
            const { match, categories, searchArea, searchCity, fecthData } = nextProps
            const currentCategory = getCurrentCategory(match, categories)
            fecthData(currentCategory, searchArea, searchCity);
        }
    }

    renderMarkerContent(marker) {
        return (
            <div className="marker-tooltip">
                <div className="marker-thumbnail mb-3">
                    <img className="w-100 h-100" src={ marker.thumbnailUrl } />
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

    componentDidMount() {
        const $bigMap = $('#big-map')
        var $parentBigMap = $bigMap.parent()
        const bigMapHeight = $parentBigMap.innerHeight()
        $bigMap.find('.g-map').css('height', `${bigMapHeight}px`)
    }

    setStateRandomProject(randomItems) {
        const { getItemsWithPath } = this.props
        const itemWithPath = getItemsWithPath(randomItems)
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

    render() {
        const { match, pageCoverImage, currentCategory, onItemHover, items } = this.props
        return (
            <div id="big-map" className="big-map-container">
                <div className="g-map big-g-map">
                    <GoogleMap {...this.props.map} renderMarkerContent={ this.renderMarkerContent } />
                </div>
                <div className="page-titles mt-4 mb-3">
                    <span className="page-title">{ localizationString.getString("Dự án") }</span>
                    <span>|</span>
                    <span className="page-title">{ localizationString.getString("Công trình khác") }</span>
                </div>

                <Pagination items={ this.state.randomItems } itemWrapperClassName="page-item" itemPerPage={ 3 } renderItem={ renderItem } />
            </div>
        );
    }
}

const bigMapId = pageConfigures.bigMapId;

const mapStateToProps = (state, ownProps) => {
    return {
        map: state.googleMap[ bigMapId ]
    }
}

export default connect(mapStateToProps)(BigMap);