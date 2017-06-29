//React/Redux
import React, { Component } from 'react'
import { Switch, Route } from 'react-router'

//Components
import { default as BasePage } from '../shared/_layout/main/base-page'
import { Container } from 'reactstrap'

//Views
import { default as DefaultView } from './views/default'

//Helper function
const { fetchEntities } = require('../shared/utilities')

//Page configuration
const pageConfigure = require('./configuration.js')

class HoiDap extends Component {

    constructor(props) {
        super(props);
        this.renderRoutes = this.renderRoutes.bind(this)
    }

    componentWillMount() {
        const { onError, onDataFetch, items } = this.props

        if (!items) {
            const postParams = {
                entityTypeId: pageConfigure.ENTITY_TYPE_ID,
                additionalFields: [ 'content' ]
            }

            fetchEntities(pageConfigure.mvcController, postParams, null, (items) => {
                onDataFetch({ items, totalPages: items.length }, 100)
            })
        }
    }

    renderRoutes() {
        const { match } = this.props
        return (
            <Switch>
                <Route exact={ true } path={ `${match.path}` } component={ DefaultView } />
                <Route path={ `${match.path}/:page` } component={ DefaultView } />
            </Switch>
        )
    }

    render() {
        const { dataFetchProgress, items, totalPages, match } = this.props
        const currentPage = match.params ? parseInt(match.params.page) : 1
        if (dataFetchProgress != 100)
            return null

        if (__DEV__) {
            console.log(pageConfigure.page + ' props: ')
            console.log(this.props)
        }

        return (
            <Container id="thu-vien">
                { this.renderRoutes() }
            </Container>
        );
    }
}

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(HoiDap);