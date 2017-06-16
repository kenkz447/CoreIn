import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
import { default as Breadcrumbs } from './breacrumbs'
import { connect } from 'react-redux';

const ConnectedBreadcrumbs = (props) => {
    const { routes, params } = props;
    if (routes)
        return (
            <Container className="d-none d-lg-block mb-lg-4">
                <Breadcrumbs Link={ Link } routes={ routes } params={ params } setDocumentTitle={ true } />
            </Container>
        )
    else
        return null
}

const stateToProps = (state) => ({
    routes: state.appRouter.routePath
});


export default connect(stateToProps)(ConnectedBreadcrumbs)