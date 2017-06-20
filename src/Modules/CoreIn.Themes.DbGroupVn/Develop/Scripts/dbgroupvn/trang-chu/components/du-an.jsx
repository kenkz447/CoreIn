const { Row, Col } = require('reactstrap');
const { Link } = require('react-router-dom');

const SectionTitle = require('../../shared/components/section-title');

const DuAnItem = require('../../shared/components/du-an/du-an');

const { dataRequest } = require('../../shared/ultilities');

class DuAn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: []
        }

        dataRequest("/project/GetTableData", 7, 1, null, null, null, null, (response) => {
            this.setState({ projects: response });
        });
    }
    render() {
        return (
            <section className={ this.props.className }>
                <SectionTitle>{ localizationString.getString('Dự án') }</SectionTitle>
                <Row className="pt-3">
                    {
                        this.state.projects.length &&
                        this.state.projects.map((project, index) => {
                            return (
                                <Col key={ project.id } xs="6" md="4" lg="3" className="page-item">
                                    <DuAnItem data={ project } />
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

module.exports = DuAn;