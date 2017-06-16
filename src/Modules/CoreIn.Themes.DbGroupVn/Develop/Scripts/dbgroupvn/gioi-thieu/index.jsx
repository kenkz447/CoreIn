const { bindActionCreators } = require('redux');

const { Container, Row } = require('reactstrap');
const { Image,  Title, PageArticle } = require('../shared/components');
const QuyTrinh = require('./components/quy-trinh');

const BasePage = require('../shared/_layout/main/base-page');

class PageComponent extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const { onError, onDataFetch, article, procedure } = this.props;

        if(!article)
            $.get('/page/GetSingle?entityName=ve-chung-toi', function (response) {
                onDataFetch({ article: response}, 50);
            });

        if(!procedure)    
            $.get('/optionGroup/GetSingle?entityName=quy-trinh', function (response) {
                onDataFetch({ procedure: response.details }, 50);
            });
    }

    render() {
        if (this.props.dataFetchProgress != 100)
            return null;

        const { article, procedure } = this.props;

        return (
            <div id="gioi-thieu">
                { article && <PageArticle className="mb-5 mb-xl-6" {...article.details}/> }
                { procedure && <QuyTrinh items={ procedure.options } title={procedure.title}/> }
            </div>
        );
    }
}

module.exports = BasePage({ page: 'gioi-thieu' })(PageComponent);