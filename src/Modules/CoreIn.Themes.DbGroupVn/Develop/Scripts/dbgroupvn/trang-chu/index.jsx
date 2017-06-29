
import { default as BasePage } from '../shared/_layout/main/base-page'

const { Container } = require('reactstrap');
const Slider = require('./components/slider');
const ConTrinh = require('./components/cong-trinh');
const DuAn = require('./components/du-an');


class PageComponent extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const { onError, onDataFetch, dataFetchProgress, projectItems } = this.props;

    }

    render() {
        const { dataFetchProgress, onDataFetch } = this.props;

        return (
            <div id="gioi-thieu">
                <Slider className="mb-lg-5" />
                <Container className="pt-5">
                    <ConTrinh className="mb-3 mb-md-5" />
                    <DuAn className="pt-5" onDataFetch={ onDataFetch } />
                </Container>
            </div>
        );
    }
}

module.exports = BasePage({ page: 'trang-chu' })(PageComponent);