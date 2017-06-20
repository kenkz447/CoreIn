const { bindActionCreators } = require('redux');
const { connect } = require('react-redux')

import { Container, Row, Col } from 'reactstrap'
import BasePage from '../shared/_layout/main/base-page'
import { refreshRoutePath } from '../routes'

import { Sidebar, Image, CategoryMenu } from '../shared/components'

import { dataRequest } from '../shared/ultilities'
import PageItem from './components/page-item'

class PageComponent extends React.Component {
    constructor() {
        super();
        this.renderSidebar = this.renderSidebar.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    componentWillMount() {
        const { onError, onDataFetch, refreshRoutePath, categories, page, items, currentCategory  } = this.props

        if (!page)
            $.get('/page/getsingle?entityName=cong-trinh', function (response) {
                onDataFetch({ page: response.details }, 50);
            })
        if (!categories)
            $.get('/TaxonomyUI/GetTaxonomies', { taxonomyTypeId: 10003 }, function (response) {
                onDataFetch({ categories: response }, 50)
            })

        if (!items)
            this.fetchData(currentCategory)

        refreshRoutePath('cong-trinh')
    }

    fetchData(currentCategory) {
                const { onDataFetch } = this.props

            dataRequest('/construction/gettabledata', 9, 1, null, null, currentCategory && { 10003: currentCategory.id }, null, function (response) {
                onDataFetch({ items: response }, 0)
            })
    }

    componentWillReceiveProps(nextProps){
        const {currentCategory} = this.props;
        if(currentCategory && nextProps.currentCategory && currentCategory.id != nextProps.currentCategory.id)
        this.fetchData(nextProps.currentCategory)
    }

    renderSidebar() {
        const { categories, onDataFetch, currentCategory } = this.props;

        return (
            <Sidebar>
                { categories && <CategoryMenu currentCategory={currentCategory} categories={ categories } onDataFetch={onDataFetch}/> }
            </Sidebar>
        )
    }

    render() {
        
        if (this.props.dataFetchProgress != 100)
            return null;

        const { page: { thumbnail }, categories, items , currentCategory} = this.props;

        return (
            <Container id="construction"> 
                <Row>
                    <Col lg="3">
                        { this.renderSidebar() }
                    </Col>
                    <Col xs="12" lg="9">
                        <Image {...thumbnail} />
                        <div className="page-titles mt-4 mb-3">
                            <span className="page-title">{localizationString.getString("Bộ sưu tập")}</span>
                            <span>|</span>
                            <span className="page-title">{currentCategory ? currentCategory.title :localizationString.getString("Tất cả") }</span>
                        </div>
                        <Row>
                            {
                                items.length &&
                                items.map((item, index) => {
                                    return (
                                        <Col key={ item.id } xs="6" lg="4" className="page-item">
                                            <PageItem data={ item } />
                                        </Col>
                                    );
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const stateToProps = (state) => ({

})

const dispathToProps = (dispath) => (
    bindActionCreators({ refreshRoutePath }, dispath)
)

const ConnectedPageComponent = connect(stateToProps, dispathToProps)(PageComponent)

module.exports = BasePage({ page: 'cong-trinh', showBreadcrumbs: true })(ConnectedPageComponent);