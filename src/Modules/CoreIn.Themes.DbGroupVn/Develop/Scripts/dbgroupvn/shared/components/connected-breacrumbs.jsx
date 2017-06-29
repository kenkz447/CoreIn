import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

const ConnectedBreadcrumbs = (props) => {
    const { routes, params } = props;
    if (routes)
        return (
            <Container className="mb-lg-4">
                <div id="breadcrumbs" className="breadcrumbs">
                    {
                        routes.map((route, index) => {
                            const isLast = (route.path === routes[ routes.length -1 ].path)

                            return (
                                <span key={index} className="">
                                    {
                                        !isLast ? <Link to={ route.path }>{route.label}</Link>
                                            : <a>{route.label}</a>
                                    }
                                </span>
                            )
                        })
                    }
                </div>
            </Container>
        )
    else
        return null
}

ConnectedBreadcrumbs.defaultProps = {
    routes: []
}

const stateToProps = (state) => ({
    routes: state.appRouter.routePath
});


export default connect(stateToProps)(ConnectedBreadcrumbs)