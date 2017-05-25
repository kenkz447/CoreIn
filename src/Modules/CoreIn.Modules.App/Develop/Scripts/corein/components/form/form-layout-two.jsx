const $ = require('jquery');
const { Row, Col, Card, CardBlock } = require('reactstrap');

const BaseForm = require('./base-form');

class Form extends BaseForm {
    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                {this.renderFormHeader()}
                <Row>
                    <Col md="9">
                        {this.renderDetailFields()}
                    </Col>
                    <Col md="3">
                        <Card>
                            <CardBlock>
                                {this.renderTaxonomies()}
                            </CardBlock>
                        </Card>
                        <Card>
                            <CardBlock>
                                {this.renderMetaFields()}
                                {this.renderFormActions()}
                            </CardBlock>
                        </Card>
                    </Col>
                </Row>
            </form>
        );
    }  
};

module.exports = Form;