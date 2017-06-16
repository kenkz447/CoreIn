import TrangChu from './trang-chu/index'
import VeChungToi from './gioi-thieu/index'
import CongTrinh from './cong-trinh/index'
import BoSuuTap from './bo-suu-tap/index'

const getRoutes = () => ({
    exact: true,
    path: '/',
    name: 'trang-chu',
    label: localizationString.getString("Trang chủ"),
    component: TrangChu,
    childRoutes: [
        {
            exact: true,
            path: '/ve-chung-toi',
            name: 've-chung-toi',
            defaultLabel: localizationString.getString("Về chúng tôi"),
            component: VeChungToi
        },
        {
            exact: true,
            path: '/cong-trinh',
            name: 'cong-trinh',
            defaultLabel: localizationString.getString("Công trình"),
            component: CongTrinh
        },
                {
            exact: true,
            path: '/bo-suu-tap',
            name: 'bo-suu-tap',
            defaultLabel: localizationString.getString("Bộ sưu tập"),
            component: BoSuuTap
        }
    ]
})

const getRoutePath = (routes = [], currentRouteName, labels) => {
    var resultRoutePath = []

    for (var routeIndex in routes) {
        var route = routes[ routeIndex ]

        if (labels && labels[ route.name ])
            route.label = labels[ route.name ]
        else
            route.label = route.defaultLabel

        if (route.name == currentRouteName) {
            resultRoutePath.push(route)
            return resultRoutePath
        } else if (route.childRoutes) {
            resultRoutePath.push(route)
            var nextRoute = getRoutePath(route.childRoutes, currentRouteName, labels);
            if (nextRoute.length) {
                resultRoutePath = resultRoutePath.concat(nextRoute)
                return resultRoutePath
            } else
                resultRoutePath = []
        } else {
            resultRoutePath = []
        }
    }

    return resultRoutePath
}

const INIT_ROUTES = "INIT_ROUTES"
const REFRESH_ROUTE_PATH = "REFRESG_ROUTE_PATH"

const refreshRoutePath = (currentRouteName, replaceRouteDefaultLabels) => ({
    type: REFRESH_ROUTE_PATH,
    currentRouteName,
    replaceRouteDefaultLabels
})

const reducer = (state = {}, action) => {
    if (action.type === INIT_ROUTES) {
        return $.extend(true, { routes: getRoutes() }, state)
    }
    if (action.type === REFRESH_ROUTE_PATH) {
        const routePath = getRoutePath(state.routes.childRoutes, action.currentRouteName, action.routeLabels);
        routePath.unshift(state.routes)
        return $.extend(true, {}, state, { routePath })
    }

    return state
}

export { reducer, refreshRoutePath, INIT_ROUTES }