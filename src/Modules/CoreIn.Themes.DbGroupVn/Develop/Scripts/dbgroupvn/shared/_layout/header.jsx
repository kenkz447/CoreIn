const { Container, Row, Col } = require('reactstrap');

const LanguageSelect = require('./header/language-select');
const Search = require('./header/search');
const Logo = require('./header/logo');
const Menu = require('./header/menu').default;
const MobileHeader = require('./header/header-mobile');
const classNames = require('classnames');

module.exports = class extends React.Component {
    render() {
        return (
            <header {...this.props}>
                <Container className="d-none d-md-block">
                    <Row>
                        <Col md="2">
                            <Logo />
                        </Col>
                        <Col md="10">
                            <Row>
                                <div className="w-100">
                                    <div className="float-right">
                                        <div className="float-left language-select pr-3 mr-3">
                                            <LanguageSelect />
                                        </div>
                                        <div className="float-left">
                                            <Search />
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <Row className="menu-container">
                                <div className="align-items-end d-flex">
                                    <Menu />
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <MobileHeader className="d-block d-md-none" />
            </header>
        );
    }

}