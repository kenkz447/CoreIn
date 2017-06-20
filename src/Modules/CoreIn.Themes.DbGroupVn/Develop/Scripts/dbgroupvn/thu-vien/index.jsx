//React/Redux
import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//Actions
import { refreshRoutePath } from '../routes'

//Components
import BasePage from '../shared/_layout/main/base-page'

import { Sidebar, SidebarMenu } from '../shared/components'
import { Container, Row, Col } from 'reactstrap'

//Routes component
import { default as DefaultView } from './components/default-view'

//Page configuration
const pageConfigure = require('./configuration.js')
const { getCategoryUrl, getCurrentCategory } = require('./helper/functions')


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
                    path: getCategoryUrl(match, localizationString.getString('tat-ca'), 1),
                    title: localizationString.getString("Tất cả")
                })
                onDataFetch({ categories: responseCategories }, 50)
            })

        refreshRoutePath(pageConfigure.page)
    }

    renderSidebar() {
        const { categories, match } = this.props;

        const categoryMenuItems = categories.map(({ name, title }) => {
            return { path: getCategoryUrl(match, name, 1), title }
        })

        return (
            <Sidebar title={ localizationString.getString("Danh mục") }>
                <SidebarMenu noBorder title={ localizationString.getString('loại công trình') }
                    items={ categoryMenuItems }
                    currentUrl={ match.url }
                />
            </Sidebar>
        )
    }

    renderRoutes() {
        const { match, categories, onDataFetch } = this.props;

        return (
            <Switch>
                <Route path={ match.path } render={ (route) => <DefaultView {...route} onDataFetch={ onDataFetch } /> } />
            </Switch>
        )
    }

    render() {
        return (
            <Container id="thu-vien">
                <Row>
                    <Col xl="12" lg="4" xl="3">
                        { this.renderSidebar() }
                    </Col>
                    <Col xl="12" lg="8" xl="9">
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
    ...bindActionCreators({ refreshRoutePath }, dispatch),
})

const ConnectedThuVien = connect(mapStateToProps, mapDispatchToProps)(ThuVien);

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(ConnectedThuVien);