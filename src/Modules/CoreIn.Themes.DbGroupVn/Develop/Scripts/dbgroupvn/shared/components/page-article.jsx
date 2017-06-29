const classnames = require('classNames');
const { Container, Row } = require('reactstrap');
const Title = require('./section-title');
const Image = require('./image');

const renderArticle = (props) => {
    const { className, thumbnail, title, content } = props;
    return (
        <article className={classnames(className)}>
            <Container fluid className="mb-5">
                <Row>
                    <Image className="h-100" {...thumbnail} />
                </Row>
            </Container>
            <Container>
                <Title>{title}</Title>
                <div className="ml-3 mr-3 ml-lg-0 mr-lg-0" dangerouslySetInnerHTML={{ __html: content }} />
            </Container>
        </article>
    );
}

export default renderArticle;