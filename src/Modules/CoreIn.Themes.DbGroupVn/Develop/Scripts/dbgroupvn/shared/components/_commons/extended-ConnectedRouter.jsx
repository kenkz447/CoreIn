import { Route, Switch, Redirect } from 'react-router'
import { ConnectedRouter, } from 'react-router-redux'
import { connect } from 'react-redux'

const DuAn = require('../../../du-an/index')

const renderRoute = (route) => {
    const { name, childRoutes, redirectToChild, path, component } = route

    if (redirectToChild != null || redirectToChild != undefined)
        return (
            <Switch key={ name }>
                {
                    childRoutes.map((child, index) => {
                        if (!child.defaultLabel)
                            child.defaultLabel = route.defaultLabel

                        if (String(child.path).startsWith('/:'))
                            child.path = path + child.path

                        if (!child.component)
                            child.component = component
                            
                        return renderRoute(child)
                    })
                }
                <Redirect from={ path } to={ path + childRoutes[ redirectToChild ].defaultLocation } />
            </Switch>
        )

    return <Route key={ name } {...route} />
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