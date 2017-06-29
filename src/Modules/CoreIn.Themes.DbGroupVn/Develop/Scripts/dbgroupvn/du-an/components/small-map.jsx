import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input } from 'reactstrap'
import { SidebarWidget, GoogleMap } from '../../shared/components'

import { default as classNames } from 'classnames'
const pageConfigures = require('../configuration.js')

class SmallMap extends Component {
    renderMarkerContent(marker) {
        return (
            <div className="marker-info">
                <label className="label">
                    { marker.title || `Missing Title` }
                </label>
                <br />
                <a className={ classNames('map-marker-hint__ap-link') }>
                    { localizationString.getString("Click to view more info") }
                </a>
            </div>
        )
    }
    
    render() {
        
        return (
            <SidebarWidget noBorder noCollapse title={ localizationString.getString('Bản đồ') }>
                <div className="no-left-space">
                    <div className="g-map">
                        <GoogleMap {...this.props.map} renderMarkerContent={ this.renderMarkerContent } />
                    </div>
                    <div className={classNames('mt-3', {'d-none': this.props.hiddenBigMapLink})}>
                        <Link className="btn btn-secondary" to={ this.props.linkToBigMap }>
                            { localizationString.getString("Xem bản đồ") }
                        </Link>
                    </div>
                </div>
            </SidebarWidget>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        map: state.googleMap[ pageConfigures.smallMapId ]
    }
}

export default connect(mapStateToProps)(SmallMap);