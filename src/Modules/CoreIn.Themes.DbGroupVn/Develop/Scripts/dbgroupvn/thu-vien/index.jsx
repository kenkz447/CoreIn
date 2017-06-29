//React/Redux
import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//Actions

//Components
import { default as BasePage } from '../shared/_layout/main/base-page'
import { Sidebar, SidebarMenu } from '../shared/components'
import { Container,  Row, Col} from 'reactstrap'

//Routes component
import { default as DefaultView } from './views/default-view'

//Page configuration
const pageConfigure = require('./configuration.js')

import { createCategoryUrlFromRoutePathAndCategoryName } from '../shared/utilities'

class ThuVien extends Component {
    static defaultProps = {
        categories: []
    }

    constructor(props) {
        super(props);
        this.renderSidebar = this.renderSidebar.bind(this)
    }

    componentWillMount() {
        const { match, onError, onDataFetch, refreshRoutePath, categories, pageContent, items } = this.props

        if (!pageContent)
            $.get(`/page/getsingle?entityName=${pageConfigure.page}`, function (response) {
                onDataFetch({ pageContent: response.details }, 50);
            })

        if (!categories.length)
            $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: pageConfigure.TAXONOMY_TYPE_ID_CATEGORY }, function (responseCategories) {
                responseCategories.unshift({
                    name: localizationString.getString('tat-ca'),
                    path: createCategoryUrlFromRoutePathAndCategoryName(match.path, localizationString.getString('tat-ca')),
                    title: localizationString.getString("Tất cả")
                })
                onDataFetch({ categories: responseCategories }, 50)
            })
    }

    renderSidebar() {
        const { categories, match: { path, url } } = this.props;

        const categoryMenuItems = categories.map(({ name, title }) => {
            return { path: createCategoryUrlFromRoutePathAndCategoryName(path, name), title }
        })

        return (
            <Sidebar title={ localizationString.getString("Danh mục") }>
                <SidebarMenu noBorder title={ localizationString.getString('loại công trình') }
                    items={ categoryMenuItems }
                    currentUrl={ url }
                />
            </Sidebar>
        )
    }

    renderRoutes() {
        const { match: { path }, categories, onDataFetch } = this.props;

        return (
            <Switch>
                <Route exact={ true } path={ path } render={ (route) => <DefaultView {...route} onDataFetch={ onDataFetch } /> } />
                <Route path={ path + '/:page' } render={ (route) => <DefaultView {...route} onDataFetch={ onDataFetch } /> } />
            </Switch>
        )
    }

    render() {
        const { dataFetchProgress, match } = this.props

        if (__DEV__) {
            console.log(pageConfigure.page + ' props: ')
            console.log(this.props)
        }

        if(dataFetchProgress != 100)
            return null

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

const ConnectedThuVien = connect(mapStateToProps, mapDispatchToProps)(ThuVien);

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(ConnectedThuVien);