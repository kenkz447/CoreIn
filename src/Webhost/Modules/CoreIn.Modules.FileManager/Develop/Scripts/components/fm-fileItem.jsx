const react = require('react');
const $ = require('jquery');
const { connect } = require('react-redux');
const { fileChecked, toggleAside} = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { reduxForm } = require('redux-form');
const { dynamicFormValidator, DynamicForm, tabControlActions: { tabAdd, tabRemove } } = require('corein');
const { updateFileSubmit } = require('./fm-formSubmits');

const fmKeys = require('./fm-keys');

class FileItem extends react.Component {
    onClick(event) {
        const { onChecked, checkedFiles, options : { allowSelectMulti }} = this.props;

        let $target = $(event.target),
            fileName = $target.data('file-name'),
            isCheckboxChecked = $target.prop('checked');

        if(!isCheckboxChecked)
            onChecked(fileName, isCheckboxChecked);
        else
            checkedFiles.push(fileName);

        const $checkboxes = $('.thumb-checkbox');

        let firstChecked = $checkboxes.filter('[data-file-name="' + checkedFiles[0] + '"]')[0];

        if (event.shiftKey && checkedFiles.length > 1) {
            var start = $checkboxes.index(firstChecked),
                end = $checkboxes.index(event.target);

            $checkboxes.map((index, checkbox) => {
                const isChecked = (end < start && (index >= end && index <= start)) || (end > start && (index >= start && index <= end));
                checkbox.checked = isChecked;
                onChecked(checkbox.getAttribute("data-file-name"), isChecked);
            });
        }
        else if (event.ctrlKey) {

        }
        else {
            if (checkedFiles.length > 1) {
                $target.prop('checked', true);
                onChecked($target.data("file-name"), true);
            }

            var $checkedCheckboxes = $checkboxes.filter(':checked').not($target);
            $checkedCheckboxes.map((index, checkbox) => {
                checkbox.checked = false;
                onChecked(checkbox.getAttribute("data-file-name"), false);
            });
        }

    }

    onInfoClick() {
        const { tabAdd, tabRemove, toggleAside } = this.props;
        getFormInfoFromServer((formResult) => {
            const form = formResult.result;
            const formId = "properties";

            const validate = dynamicFormValidator({ details: form.details, meta: form.meta });
            const submit = updateFileSubmit({ successAction: {}});
            const ReduxDynamicForm = reduxForm({ form: formId, validate, initialValues: form.initialValues })(DynamicForm);

            tabRemove(formId); 
            tabAdd(
                formId,
                '<i class="icon-wrench icons"></i> ' + form.fileName,
                <ReduxDynamicForm formData={form} onSubmit={submit} onClose={() => { toggleAside(false); tabRemove(formId); }} />
            );
            toggleAside(true);
        }, this.props.data.fileName);
    }

    render() {
        const { data: {fileId, fileName, meta: {type, src_thumb, ext}} } = this.props;
        const fieldId = `file_${fileId}`;
        const fieldName = `file[${fileId}]`;
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0">
                <div className="card card-fileThumb mb-1 mr-1">
                    <label className="fancy-checkbox-label" htmlFor={fieldId}>
                        <input type="checkbox" className="thumb-checkbox" id={fieldId} name={fieldName} data-file-id={fileId} data-file-name={fileName} onClick={this.onClick.bind(this)} />
                        <span className="fancy-checkbox fancy-checkbox-img"/>
                        {(type === 'Image'
                            ? <img src={src_thumb} alt={fileName}/>
                            : <span className="fancy-thumb-icon"><i className="fa fa-file"></i> <b>{ext}</b></span>)}
                    </label>
                    <div className="file-info p-1" onClick={this.onInfoClick.bind(this)}>
                        <i className="fa fa-info" aria-hidden="true"></i>
                        <span className="file-name">{fileName}</span>
                    </div>
                </div>
            </div>
        );
    }
}
const stateToProps = (state) => ({
    options: state.fm.options,
    checkedFiles: state.fm.checkedFiles
});

const dispatchToProps = (dispatch) => (
    bindActionCreators({ onChecked: fileChecked, toggleAside, tabAdd, tabRemove }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);