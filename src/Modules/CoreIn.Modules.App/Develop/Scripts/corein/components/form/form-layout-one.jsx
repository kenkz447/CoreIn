const $ = require('jquery');
const BaseForm = require('./base-form');

class Form extends BaseForm {
    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                {this.renderFormHeader()}
                {this.renderMetaFields()}
                {this.renderDetailFields()}
                {this.renderTaxonomies()}
                {this.renderFormActions()}
            </form>
        );
    }  
};

module.exports = Form;