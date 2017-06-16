const $ = require('jquery');
const { Row, Col, Card, CardBlock } = require('reactstrap');

const BaseForm = require('./base-form');

class Form extends BaseForm {
    componentDidMount() {
        jQuery("#FormActions").stick_in_parent({ offset_top: 70 });
    }

    render() {
        const { handleSubmit, formData: { taxonomyTypes } } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                {this.renderFormHeader()}
                <Row>
                    <Col md="9">
                        {this.renderDetailFields()}
                    </Col>
                    <Col md="3">
                        { taxonomyTypes &&
                            <Card>
                                <CardBlock>
                                    {this.renderTaxonomies()}
                                </CardBlock>
                            </Card>
                        }

                        <Card id="FormActions">
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