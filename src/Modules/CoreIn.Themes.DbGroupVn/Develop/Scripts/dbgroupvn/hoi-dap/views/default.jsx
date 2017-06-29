import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Pagination } from '../../shared/components'

import { renderItem } from '../helpers/render-items'

const pageConfigure = require('../configuration.js')

class DefaultView extends Component {
    static defaultProps = {
        items: []
    }

    render() {
        const { match, items, totalPages } = this.props
        const currentPage = match.params.page ? parseInt(match.params.page) : 1

        if(__DEV__){
            console.warn('DefaultView Props:')
            console.log(this.props)
        }

        return (
            <Pagination itemWrapperClassName="hoi-dap-item" className="w-100"
                layout={ { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 } }
                items={ items.length ? [ items[ currentPage - 1 ] ] : [] }
                totalPages={ totalPages }
                currentPage={ currentPage }
                templatePath={ match.path }
                renderItem={ renderItem }
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { items, totalPages } = state.connectedBasePage.pages[ pageConfigure.page ]
    return {
        items, totalPages
    }
}

export default connect(mapStateToProps)(DefaultView);