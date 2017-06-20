const { bindActionCreators } = require('redux');
const { connect } = require('react-redux')
import _ from 'underscore'
import { Route, Switch } from 'react-router'
import { Container, Row, Col } from 'reactstrap'
import BasePage from '../shared/_layout/main/base-page'
import { Sidebar, SidebarMenu, Image, CategoryMenu, PageItem } from '../shared/components'

import { refreshRoutePath } from '../routes'

import { default as BigMap } from './components/big-map'
import { default as Category } from './components/category'
import { default as SearchByArea } from './components/search-area';
import { default as SearchByCity } from './components/sreach-city';
import { default as SmallMap } from './components/small-map';
import { setMapValue, setMapMarkers, showMarkerBalloon } from '../shared/reducers/google-map'
import { dataRequest } from '../shared/ultilities'

const pageConfigure = {
    pageName: 'du-an',
    taxonomyTypeId: 20003,
    showBreadcrumb: true
}

const smallMapId = require('./page-configure.js').smallMapId
const bigMapId = require('./page-configure.js').bigMapId

const defaultMap = {
    center: [ 15.866913899999986, 104.1218629 ],
    zoom: 5,
}

class PageComponent extends React.Component {
    static defaultProps = {
        map: defaultMap,
        items: []
    }

    constructor() {
        super()
        this.renderSidebar = this.renderSidebar.bind(this)
        this.fecthData = this.fecthData.bind(this)
        this.getCurrentChildRoute = this.getCurrentChildRoute.bind(this)
        this.getItemsWithPath = this.getItemsWithPath.bind(this)
    }

    componentWillMount() {
        const { onError, onDataFetch, refreshRoutePath, categories, page, items } = this.props

        if (!page)
            $.get(`/page/getsingle?entityName=${pageConfigure.pageName}`, function (response) {
                onDataFetch({ page: response.details }, 50);
            })
        if (!categories)
            $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: pageConfigure.taxonomyTypeId }, function (response) {
                onDataFetch({ categories: response }, 50)
            })

        refreshRoutePath(pageConfigure.pageName)
    }

    onSearchByArea(from, to) {
        var searchArea = { from, to }

        if (from === -1 || to === -1)
            searchArea = null

        this.props.onDataFetch({ searchArea }, 0)
    }

    onSearchByCity(city, map) {
        const { setMapValue, searchArea } = this.props;

        this.props.onDataFetch({ searchCity: city }, 0)

        const currentChildRoute = this.getCurrentChildRoute()
        const mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId

        setMapValue(mapId, map || defaultMap)
    }

    getItemsWithPath(items) {
        const { match } = this.props
        const itemsWithPath = items.map((item) => {
            const itemWithPath = $.extend(true, {}, item, { path: `${match.path}/${item.name}` })
            return itemWithPath
        })
        return itemsWithPath
    }

    onCategoryFetchComplete(items) {
        const { setMapMarkers, match, onDataFetch } = this.props

        const currentChildRoute = this.getCurrentChildRoute()
        const mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId

        const markers = items.map(({ id, name, thumbnailUrl, moreDetailts: { mapLongitude, mapLatitude }, title }) => {
            return {
                id,
                lat: mapLatitude,
                lng: mapLongitude,
                title,
                thumbnailUrl: `/${thumbnailUrl}`,
                redirect: `${match.path}/chi-tiet/${name}`,
                height: (mapId === bigMapId) && 280,
                path: `${match.path}/${name}`
            }
        })

        const itemsWithPath = this.getItemsWithPath(items)

        onDataFetch({ items: itemsWithPath }, 0)

        setMapMarkers(mapId, markers)
    }

    onItemHover(isHover, item) {
        const { showMarkerBalloon } = this.props
        var markerId = isHover ? item.id : null

        const currentChildRoute = this.getCurrentChildRoute()
        const mapId = currentChildRoute === "/ban-do" ? bigMapId : smallMapId

        showMarkerBalloon(mapId, markerId)
    }

    fecthData(category, searchArea, searchCity) {
        var filter = []

        if (searchArea)
            filter.push(
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
            filter.push({
                id: 'city',
                value: searchCity,
                operator: '=='
            })
        const additionalFields = [ 'mapLongitude', 'mapLatitude' ]
        dataRequest('/project/gettabledata', 9, 1, null, filter, category && { [ pageConfigure.taxonomyTypeId ]: category.id }, additionalFields, this.onCategoryFetchComplete.bind(this))
    }

    getCurrentChildRoute() {
        const { match, location } = this.props;
        return String(location.pathname).startsWith(`${match.path}/ban-do`) ? '/ban-do' : ''
    }

    renderSidebar() {
        const { categories, currentCategory, match, location } = this.props;

        const mapPage = this.getCurrentChildRoute()
        const page = mapPage ? '' : '/1'

        const categoryMenuItems = categories && categories.map((category) => {
            return { path: `${match.path}${mapPage}/${category.name}${page}`, title: category.title, id: category.id }
        })

        categoryMenuItems.unshift({ path: `${match.path}${mapPage}/${localizationString.getString('tat-ca')}${page}`, title: localizationString.getString("Tất cả") })

        return (
            <Sidebar>
                <SidebarMenu title={ localizationString.getString('loại công trình') }
                    items={ categoryMenuItems }
                    currentUrl={ match.url }
                />
                <SearchByArea onSearch={ this.onSearchByArea.bind(this) } />
                <SearchByCity onCityChange={ this.onSearchByCity.bind(this) } />
                <SmallMap map={ this.props.map }
                    linkToBigMap={ `${match.path}/ban-do/${currentCategory ? currentCategory.name : localizationString.getString('tat-ca')}` }
                    hiddenBigMapLink={ mapPage != '' }
                />
            </Sidebar>
        )
    }

    render() {
        if (this.props.dataFetchProgress != 100)
            return null;
        console.log(this.state)

        const { match, page: { thumbnail }, categories, currentCategory, searchArea, searchCity, items } = this.props

        const commonRouteProps = {
            items: items,
            searchArea: searchArea,
            searchCity: searchCity,
            categories: categories,
            basePath: match.path,
            fecthData: this.fecthData
        }

        return (
            <Container id={ pageConfigure.pageName }>
                <Row>
                    <Col lg="3">
                        { this.renderSidebar() }
                    </Col>
                    <Col xs="12" lg="9">
                        <Switch>
                            <Route exact={ false } path={ `${match.url}/ban-do/:category` } render={ (route) => {
                                return (
                                    <BigMap {...route}
                                        {...commonRouteProps}
                                        getItemsWithPath={this.getItemsWithPath}
                                    />
                                )
                            } } />
                            <Route path={ `${match.url}/:category/:page` } render={ (route) => {
                                return (
                                    <Category match={ route.match }
                                        pageCoverImage={ thumbnail }
                                        onItemHover={ this.onItemHover.bind(this) }
                                        {...commonRouteProps}
                                    />
                                )
                            } } />
                        </Switch>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const stateToProps = (state) => ({

})

const dispathToProps = (dispath) => (
    bindActionCreators({ refreshRoutePath, setMapValue, setMapMarkers, showMarkerBalloon }, dispath)
)

const ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent)

module.exports = BasePage({ page: pageConfigure.pageName, showBreadcrumbs: pageConfigure.showBreadcrumb })(ConnectedPageComponent);