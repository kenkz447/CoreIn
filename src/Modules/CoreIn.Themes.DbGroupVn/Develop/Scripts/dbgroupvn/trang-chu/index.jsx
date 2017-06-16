
const { Container } = require('reactstrap');
const Slider = require('./components/slider');
const ConTrinh = require('./components/cong-trinh');
const DuAn = require('./components/du-an');

const BasePage = require('../shared/_layout/main/base-page');

class PageComponent extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const { onError, onDataFetch, dataFetchProgress } = this.props;

        if(dataFetchProgress != 100)
            $.get('/', function (response) {
                if (!response)
                    onError('Error');
                else
                    onDataFetch({ temp: response }, 100);
            });
    }

    render() {
        const { dataFetchProgress } = this.props;

        if (dataFetchProgress != 100)
            return null;

        return (
            <div id="gioi-thieu">
                <Slider className="mb-lg-5" />
                <Container className="pt-5">
                    <ConTrinh className="mb-3 mb-md-5" />
                    <DuAn className="pt-5" />
                </Container>
            </div>
        );
    }
}

module.exports = BasePage({ page: 'trang-chu' })(PageComponent);