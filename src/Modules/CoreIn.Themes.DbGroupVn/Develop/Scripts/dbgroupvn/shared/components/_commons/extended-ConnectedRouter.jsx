import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { connect } from 'react-redux'
const TrangChu = require('../../../trang-chu/index')

const renderRoute = ({ path, exact, component, childRoutes }, index) => {
    const routeComponent = <Route exact={ exact } key={ path } path={ path } component={ component } />

    if(childRoutes != null) {
        const routeComponents = childRoutes.map(renderRoute)
        routeComponents.push(routeComponent);
        return (
            <Switch>
                { routeComponents }
            </Switch>
        )
    }
    else
        return routeComponent
}

const renderRoutes = ({ path, exact, component, childRoutes }) => {
    const routeComponents = childRoutes.map(renderRoute);

    //Root route
    routeComponents.unshift(<Route exact={ exact } key={ path } path={ path } component={ component } />)

    return routeComponents;
}

const ExtendedConnectedRouter = ({ routes, history, wrapper }) => {
    const Wrapper = wrapper
    return (
        <ConnectedRouter history={ history }>
            <Wrapper>
                {
                    routes && renderRoutes(routes)
                }
            </Wrapper>
        </ConnectedRouter>
    )
}

const stateToProps = (state) => ({
    routes: state.appRouter.routes
})

export default connect(stateToProps)(ExtendedConnectedRouter)