
const $ = require('jquery');
const classNames = require('classnames');

const { Link } = require('react-router-dom');
const { Row, Col } = require('reactstrap');
const Title = require('../../shared/components/section-title');

module.exports = class extends React.Component {  
    render() {
        return (
            <section className={classNames('cong-trinh', this.props.className)}>
                <Title>{localizationString.getString('Công trình')}</Title>
                <Row className="mt-2">
                    <Col xs="12" md={6} className="pr-1">
                        <Row className="mb-2">
                            <Col>
                                <div data-aos="fade-left">
                                    <div className="link link-khach-san">
                                        <Link className="title" to="/" dangerouslySetInnerHTML={{ __html: localizationString.getString("Khách<br/>sạn") }} />
                                    </div>
                                    <img className="w-100" src="/img/khach-san-cover.jpg" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div data-aos="fade-left">
                                    <div className="link link-can-ho">
                                        <Link className="title" to="/" dangerouslySetInnerHTML={{ __html: localizationString.getString("Căn<br/>hộ") }} />
                                    </div>
                                    <img className="w-100" src="/img/can-ho-cover.jpg" />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs="12" md={6} className="pl-1">
                        <div className="h-100" data-aos="flip-left" data-aos-delay="300">
                            <div className="link link-nha-o">
                                <Link className="title" to="/" dangerouslySetInnerHTML={{ __html: localizationString.getString("Nhà ở") }} />
                            </div>
                            <img className="h-100 w-100" src="/img/nha-o-cover.jpg" />
                        </div>
                    </Col>
                </Row>
            </section>
        );
    }
}