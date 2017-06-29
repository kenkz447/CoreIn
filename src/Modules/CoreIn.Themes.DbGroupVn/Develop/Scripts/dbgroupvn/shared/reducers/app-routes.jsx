
const DEFAULT_MENU = 'PRIMARY'
const INIT_ROUTES = 'INIT_ROUTES'
const REFRESH_ROUTE_PATH = 'REFRESG_ROUTE_PATH'

const popularMenusFromRoute = (menus, route) => {
    let { exact, path, label, defaultLabel, menuOrders, childRoutes } = route

    //Nếu menuOrders không được định nghĩa thì không thêm route vào menu
    if (!menuOrders)
        return

    for (var menuLocation in menuOrders) {

        //Tạo menu nếu trong route được định nghĩa menuOrders
        if (!menus[ menuLocation ])
            menus[ menuLocation ] = []

        //Thứ tự của 
        let menuOrder = menuOrders[ menuLocation ]

        menus[ menuLocation ].push({
            exact, url: path, label: label || defaultLabel, order: menuOrder
        })
    }

    return menus
}

const menuFormRootRoute = (rootRoute) => {
    //menus là một object tập hợp của nhiều menu, với property là têm menu và value và array menu item
    //Mặc định cho menu của app là 'PRIMARY' được định nghĩa bởi const 'DEFAULT_MENU'
    var menus = {
        [ DEFAULT_MENU ]: []
    }

    //tạo menu item cho  trang chủ (root route)
    menus = popularMenusFromRoute(menus, rootRoute);

    let { childRoutes } = rootRoute

    //tạo menu item cho các route con
    for (var childIndex in childRoutes) {
        menus = popularMenusFromRoute(menus, childRoutes[ childIndex ])
    }

    return menus
}

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

const refreshRoutePath = (currentRouteName, replaceRouteDefaultLabels) => ({
    type: REFRESH_ROUTE_PATH,
    currentRouteName,
    replaceRouteDefaultLabels
})

const reducer = (state = {}, action) => {
    switch (action.type) {
        case INIT_ROUTES:
            const routes = action.routes
            const menus = menuFormRootRoute(routes)
            const newState = { routes, menus }
            return newState
        case REFRESH_ROUTE_PATH:
            const routePath = getRoutePath(state.routes.childRoutes, action.currentRouteName, action.routeLabels);
            routePath.unshift(state.routes)
            return $.extend(true, {}, state, { routePath })
        default:
            return state
    }
}

export { reducer, refreshRoutePath, INIT_ROUTES, DEFAULT_MENU }