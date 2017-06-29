import { connect } from 'react-redux'

const { Row, Col } = require('reactstrap');
const { Link } = require('react-router-dom');

import { Title } from '../../shared/components'

const DuAnItem = require('../../shared/components/du-an/du-an');

const { fetchEntities } = require('../../shared/utilities');

import projectPageConfigure from '../../du-an/configuration'
import { renderItem } from '../../du-an/helper/render-items'

class DuAn extends React.Component {
    static defaultProps = {
        projectItems: []
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { onDataFetch } = this.props

        const postParams = {
            page: 1,
            pageSize: 7,
        }
        const baseItemPath = `/${projectPageConfigure.page}/${projectPageConfigure.detailPath}`

        fetchEntities(projectPageConfigure.mvcController, postParams, baseItemPath, (projectItems) => {
            onDataFetch({ projectItems }, 0)
        })
    }


    render() {
        const { projectItems, className } = this.props

        return (
            <section className={ className }>
                <Title>{ localizationString.getString('Dự án') }</Title>
                <Row className="pt-3">
                    {
                        projectItems.map((project, index) => {
                            return (
                                <Col key={ project.id } xs="6" md="4" lg="3" className="page-item">
                                    { renderItem(project) }
                                </Col>
                            );
                        })
                    }
                    <Col xs="6" md="4" lg="3" className="page-item">
                        <div className="h-100" data-aos="zoom-in-up">
                            <div className="project-load-more">
                                <div className="overlay" />
                                <div className="content mr-3 mr-lg-5">
                                    <h5 className="cant-find"> can’t find<br /> your project</h5>
                                    <div className="dots clearfix">
                                        <div className="dot" />
                                        <div className="dot" />
                                        <div className="dot" />
                                        <div className="dot" />
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/du-an" className="btn-white mt-4">Load more</Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Col>
                </Row>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { projectItems } = state.connectedBasePage.pages[ 'trang-chu' ]

    return {
        projectItems
    }
}

module.exports = connect(mapStateToProps)(DuAn);