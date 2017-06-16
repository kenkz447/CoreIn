const classNames = require('classnames');

const { Container, Row, Col } = require('reactstrap');
const CopyRight = require('./footer/copy-right');
const Socials = require('./footer/socials');
const Menu = require('./footer/menu');

module.exports = class extends React.Component {
    render() {
        return (
            <div {...this.props}>
                <Container fluid>
                    <Row>
                        <Col xs="12" lg="4" xl="6" className="mb-3 mb-lg-0">
                            <CopyRight className="text-center text-xl-left"/>
                        </Col>
                        <Col xs="12" md="8" lg="6" xl="4">
                            <Menu className="text-center text-md-left text-xl-right"/>
                        </Col>
                        <Col xs="12" md="4" lg="2" xl="2">
                            <Socials  className="text-center text-md-right text-xl-right"/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}