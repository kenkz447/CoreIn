const { Container, Row, Col } = require('reactstrap');

const LanguageSelect = require('./_header/language-select');
const Search = require('./_header/search');
const Logo = require('./_header/logo');
const Menu = require('./_header/menu');

module.exports = (props) => {
    return (
        <header className="pt-4">
            <Container>
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
        </header>
    );
}