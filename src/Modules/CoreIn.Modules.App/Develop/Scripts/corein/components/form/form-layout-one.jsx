const $ = require('jquery');
const BaseForm = require('./base-form');

class Form extends BaseForm {
    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit}>
                <div>
                    {this.renderFormHeader()}
                </div>
                <div className="mb-1">
                    {this.renderMetaFields()}
                </div>
                <div className="mb-1">
                    {this.renderDetailFields()}
                </div>
                <div className="mb-1">
                    {this.renderTaxonomies()}
                </div>
                {this.renderFormActions()}
            </form>
        );
    }  
};

module.exports = Form;