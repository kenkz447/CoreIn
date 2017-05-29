const $ = require('jquery');
const _ = require('underscore');

const { connect } = require('react-redux');
const { fileChecked, toggleAside} = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { reduxForm } = require('redux-form');
const dynamicFormValidator = require('../form/validator');
const {setNestedModal} = require('./fm-actions');
const { tabAdd, tabRemove } = require('../tab-control').actions;
const formSubmit = require('../form/submit');

class FileItem extends React.Component {
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

        if (allowSelectMulti && event.shiftKey && checkedFiles.length > 1) {
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
        const { setNestedModal, tabAdd, tabRemove, toggleAside, options: { displayAsModal } } = this.props;
        getFormInfoFromServer((formResult) => {
            const form = formResult.result;
            const formId = "properties";

            const validate = dynamicFormValidator({ details: form.details, meta: form.meta });
            const onSubmit = formSubmit({
                url: '/filemanager/update',
                method: 'PUT',
                successAction: (response) => {
                    if (displayAsModal)
                        setNestedModal({ toggle: false });
                    else
                        toggleAside(false);
                }
            });

            const _form = $.extend(true, {}, form);
            _form.details = _.sortBy(form.details, (o) => o.group);

            const ReduxDynamicForm = reduxForm({
                form: formId,
                validate,
                initialValues: form.initialValues,
                formData: _form,
                onSubmit
            })(require('../form/form'));

            if (!displayAsModal) {
                tabRemove(formId);
                tabAdd(
                    formId,
                    '<i class="icon-wrench icons"></i> ' + formResult.fileName,
                    <div className="p-1"><ReduxDynamicForm onClose={() => {
                        toggleAside(false);
                        tabRemove(formId);
                    }} /></div>
                );
                toggleAside(true);
            }
            else {
                setNestedModal({ title: formResult.fileName, content: <ReduxDynamicForm layout={1} onClose={() => { setNestedModal({ toggle: false }); }}/>, toggle: true });
            }

        }, this.props.data.fileName);
    }

    render() {
        const { data: {id, fileName, type, urlThumb, extension} } = this.props;
        const fieldId = `file_${id}`;
        const fieldName = `file[${id}]`;
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0">
                <div className="card card-fileThumb mb-1 mr-1">
                    <label className="fancy-checkbox-label" htmlFor={fieldId}>
                        <input type="checkbox" className="thumb-checkbox" id={fieldId} name={fieldName} data-file-id={id} data-file-name={fileName} onClick={this.onClick.bind(this)} />
                        <span className="fancy-checkbox fancy-checkbox-img"/>
                        {(type === 'Image'
                            ? <img src={`\\${urlThumb}`} alt={fileName}/>
                            : <span className="fancy-thumb-icon"><i className="fa fa-file"></i> <b>{extension}</b></span>)}
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
    bindActionCreators({ onChecked: fileChecked, toggleAside, tabAdd, tabRemove, setNestedModal }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);