
import _ from 'underscore'
import { Route, Switch } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//Actions
import { setMapValue, setMapMarkers, showMarkerBalloon } from '../shared/reducers/google-map'

//Global Components
import { default as BasePage } from '../shared/_layout/main/base-page'
import { Container, Row, Col } from 'reactstrap'
import { Sidebar, SidebarMenu, Image, CategoryMenu, PageItem } from '../shared/components'

//Local Components
import { default as SearchByArea } from './components/search-area';
import { default as SearchByCity } from './components/sreach-city';
import { default as SmallMap } from './components/small-map';

//Views
import { default as BigMap } from './views/big-map'
import { default as DefaultView } from './views/default-view'

//Helper and utilities
import {
    createCategoryUrlFromRoutePathAndCategoryName,
    fetchEntities, fetchPage, fetchTaxonomiesByTaxonomyTypeId,
    getCategoryByNameFromCatogires,
    generateEntityDetailUrl,
} from '../shared/utilities'

//Page configures
const pageConfigure = require('./configuration.js')

class PageComponent extends React.Component {
    static defaultProps = {
        map: {
            center: [ 15.866913899999986, 104.1218629 ],
            zoom: 5,
        },
        items: []
    }

    constructor() {
        super()
        this.renderSidebar = this.renderSidebar.bind(this)
        this.renderRoutes = this.renderRoutes.bind(this)
        this.getCurrentChildRoute = this.getCurrentChildRoute.bind(this)
    }

    componentWillMount() {
        const { onError, onDataFetch, refreshRoutePath, categories, pageContent } = this.props

        if (!pageContent)
            fetchPage(pageConfigure.page).then((response) => {
                onDataFetch({ pageContent: response.details }, 50);

            })

        if (!categories)
            fetchTaxonomiesByTaxonomyTypeId(pageConfigure.TAXONOMY_TYPE_ID_CATEGORY).then((responseCategories) => {
                responseCategories.unshift({
                    name: localizationString.getString('tat-ca'),
                    title: localizationString.getString("Tất cả")
                })
                onDataFetch({ categories: responseCategories }, 50)
            })
    }

    onSearchByArea(from, to) {
        var searchArea = { from, to }
        if (from === -1 || to === -1)
            searchArea = null
        this.props.onDataFetch({ searchArea }, 0)
    }

    onSearchByCity(city, map) {
        const { setMapValue, searchArea, onDataFetch } = this.props;

        onDataFetch({ searchCity: city }, 0)

        setMapValue(pageConfigure.smallMapId, map || defaultMap)
    }

    renderSidebar() {
        const { categories, currentCategory, match: { path, url }, location } = this.props;

        const categoryMenuItems = categories.map(({ name, title }) => {
            return { path: createCategoryUrlFromRoutePathAndCategoryName(path, name), title }
        })

        return (
            <Sidebar>
                <SidebarMenu title={ localizationString.getString('loại công trình') }
                    items={ categoryMenuItems }
                />
                <SearchByArea onSearch={ this.onSearchByArea.bind(this) } />
                <SearchByCity onCityChange={ this.onSearchByCity.bind(this) } />

                <SmallMap map={ this.props.map }
                    linkToBigMap={ `/${pageConfigure.page}/ban-do/${currentCategory ? currentCategory.name : localizationString.getString('tat-ca')}` }
                    hiddenBigMapLink={ false }
                />
            </Sidebar>
        )
    }

    renderRoutes() {
        const { match: { path }, onDataFetch, setMapMarkers, showMarkerBalloon } = this.props;
        const commonProps = {
            onDataFetch,
            setMapMarkers,
            showMarkerBalloon
        }

        return (
            <Switch>
                <Route exact={ true } path={ '/' + pageConfigure.page + '/ban-do/:category' } render={ (route) => <BigMap {...route}
                    onDataFetch={ onDataFetch } {...commonProps} /> } />

                <Route exact={ true } path={ path } render={ (route) =>
                    <DefaultView {...route} {...commonProps} /> }
                />

                <Route path={ path + '/:page' } render={ (route) =>
                    (<DefaultView {...route} onDataFetch={ onDataFetch } {...commonProps} />) }
                />

            </Switch>
        )
    }

    render() {
        if (this.props.dataFetchProgress != 100)
            return null;

        console.log(this.props)

        return (
            <Container id={ pageConfigure.page }>
                <Row>
                    <Col lg="3">
                        { this.renderSidebar() }
                    </Col>
                    <Col xs="12" lg="9">
                        { this.renderRoutes() }
                    </Col>
                </Row>
            </Container>
        );
    }
}

const stateToProps = (state) => ({

})

const dispathToProps = (dispath) => (
    bindActionCreators({ setMapValue, setMapMarkers, showMarkerBalloon }, dispath)
)

const ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent)

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumb })(ConnectedPageComponent);