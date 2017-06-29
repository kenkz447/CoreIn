//React/Redux
import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//Convert flat category array to category trees
import listToTree from 'list-to-tree'

//Actions
//...

//Components
import { default as BasePage } from '../shared/_layout/main/base-page'

import { Sidebar, SidebarMenu } from '../shared/components'
import { Container, Row, Col } from 'reactstrap'

//Routes component
import { default as DefaultView } from './views/default-view'

//Page configuration
const pageConfigure = require('./configuration.js')

import {
    createCategoryUrlFromRoutePathAndCategoryName,
    fetchSingleEntity, fetchPage,
    fetchTaxonomiesByTaxonomyTypeId
} from '../shared/utilities'

class PageComponent extends Component {
    static defaultProps = {
        categories: []
    }

    constructor(props) {
        super(props);
        this.renderSidebar = this.renderSidebar.bind(this)
    }

    componentWillMount() {
        const { match, onDataFetch, refreshRoutePath, categories, pageContent, items } = this.props

        if (!pageContent)
            fetchPage(pageConfigure.page).then(function (response) {
                onDataFetch({ pageContent: response.details }, 50);
            })

        if (!categories.length)
            fetchTaxonomiesByTaxonomyTypeId(pageConfigure.TAXONOMY_TYPE_ID_CATEGORY).then(function (categories) {
                onDataFetch({ categories }, 50)
            })
    }

    renderSidebar() {
        const { categories, match: { path, url } } = this.props;

        return (
            <Sidebar>
                {
                    categories && categories.map((categoryTree) => {

                        const categoryMenuItems = categoryTree.children && categoryTree.children.map(({ name, title }) => {
                            return { path: createCategoryUrlFromRoutePathAndCategoryName(path, name), title }
                        })

                        return (
                            <SidebarMenu key={ categoryTree.name } title={ categoryTree.title }
                                titleLink={ createCategoryUrlFromRoutePathAndCategoryName(path, categoryTree.name) }
                                items={ categoryMenuItems }
                            />
                        )
                    })
                }
            </Sidebar>
        )
    }

    componentDidMount() {
        $("#sidebar-toggle-btn").stick_in_parent();

    }
    
    renderRoutes() {
        const { match: { path }, onDataFetch } = this.props;

        return (
            <Switch>
                <Route exact={ true } path={ path } render={ (route) => <DefaultView {...route} onDataFetch={ onDataFetch } /> } />
                <Route path={ path + '/:page' } render={ (route) => <DefaultView {...route} onDataFetch={ onDataFetch } /> } />
            </Switch>
        )
    }

    render() {
        const { dataFetchProgress, match } = this.props

        if (dataFetchProgress != 100)
            return null

        if (__DEV__) {
            console.log(pageConfigure.page + ' props: ')
            console.log(this.props)
        }

        return (
            <Container id="thu-vien">
                <Row>
                    <Col xs="12" lg="4" xl="3">
                        { this.renderSidebar() }
                    </Col>
                    <Col xs="12" lg="8" xl="9">
                        { this.renderRoutes() }
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({ }, dispatch),
})

const ConnectedPageComponent = connect(mapStateToProps, mapDispatchToProps)(PageComponent);

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(ConnectedPageComponent);