import React, { Component } from 'react';
import { connect } from 'react-redux'
import { default as PropTypes } from 'prop-types'

import controllable from 'react-controllables';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import Marker, { K_SCALE_NORMAL } from './marker.jsx';

import { getScale, getRealFromTo } from './helpers/calc-markers-visibility.js';
import markerDescriptions from './constants/marker-descriptions.js';
import { customDistanceToMouse } from './helpers/custom-distance.js';

const K_MARGIN_TOP = 30;
const K_MARGIN_RIGHT = 30;
const K_MARGIN_BOTTOM = 30;
const K_MARGIN_LEFT = 30;

const K_HOVER_DISTANCE = 30;

@controllable([ 'center', 'zoom', 'markers' ])
class MainMapBlock extends Component {
    static propTypes = {
        onCenterChange: PropTypes.func, // @controllable generated fn
        onZoomChange: PropTypes.func, // @controllable generated fn
        onBoundsChange: PropTypes.func,
        onMarkerHover: PropTypes.func,
        onChildClick: PropTypes.func,
        center: PropTypes.any,
        zoom: PropTypes.number,
        markers: PropTypes.any,
        visibleRowFirst: PropTypes.number,
        visibleRowLast: PropTypes.number,
        maxVisibleRows: PropTypes.number,
        hoveredRowIndex: PropTypes.number,
        openBallonIndex: PropTypes.number,
    }

    static defaultProps = {
        center: [ 15.866913899999986, 104.1218629 ],
        zoom: 5,
        options: {
            styles: [ { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [ { "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [ { "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [ { "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [ { "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [ { "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [ { "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [ { "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [ { "color": "#878787" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "invert_lightness": true }, { "weight": "3.37" }, { "gamma": "5" }, { "saturation": "0" }, { "lightness": "0" }] }]
        },
        visibleRowFirst: -1,
        visibleRowLast: -1,
        hoveredRowIndex: -1,
        maxVisibleRows: 10,
        markers: []
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillReceiveProps(nextProps) {
        const { center, zoom } = this.props
        if (nextProps.center != center || nextProps.zoom != zoom) {
            this.props.onCenterChange(center);
            this.props.onZoomChange(zoom);
        }
    }

    _onBoundsChange = ({ center, zoom, bounds, marginBounds }) => {
    }

    _onChildClick = (key, childProps) => {
        const markerId = childProps.marker.id;
        const index = this.props.markers.findIndex(m => m.id === markerId);
        var currentMarker = this.props.markers[ index ];
        
        this.props.onMarkerClick(currentMarker)
    }

    _onChildMouseEnter = (key, childProps) => {
        const markerId = childProps.marker.id;
        const index = this.props.markers.findIndex(m => m.id === markerId);
        if (this.props.onMarkerHover) {
            this.props.onMarkerHover(index);
        }
    }

    _onChildMouseLeave = (/* key, childProps */) => {
        if (this.props.onMarkerHover) {
            this.props.onMarkerHover(-1);
        }
    }

    _onBalloonCloseClick = () => {
        if (this.props.onChildClick) {
            this.props.onChildClick(-1);
        }
    }

    _distanceToMouse = customDistanceToMouse;

    render() {

        const Markers = this.props.markers &&
            this.props.markers.map((marker, index) => (
                <Marker
                    // required props
                    key={ marker.id }
                    lat={ marker.lat }
                    lng={ marker.lng }
                    // any user props
                    showBallon={ marker.id === this.props.showBalloonForMarker }
                    onCloseClick={ this._onBalloonCloseClick }
                    renderMarkerContent={ this.props.renderMarkerContent }

                    scale={  K_SCALE_NORMAL }
                    {...markerDescriptions[ 0 ]}
                    marker={ marker } />
            ));

        return (
            <GoogleMap
                bootstrapURLKeys={ { key: "AIzaSyBB5V34f3crBWyutuwFCy73IzRCdIwqUrI" } }
                center={ this.props.center }
                zoom={ this.props.zoom }
                options={ this.props.options }
                onChange={ this._onBoundsChange }
                onChildClick={ this._onChildClick }
                onChildMouseEnter={ this._onChildMouseEnter }
                onChildMouseLeave={ this._onChildMouseLeave }
                margin={ [ K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT ] }
                hoverDistance={ K_HOVER_DISTANCE }
                distanceToMouse={ this._distanceToMouse }
            >
                { Markers }
            </GoogleMap>
        );
    }
}


export default MainMapBlock
