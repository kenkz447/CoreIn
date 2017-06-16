const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const SharedForm = Corein.pageTemplates.form.default;

const store = createStore(require('./shared/redux/reducer'));

const {index, create: {formUrl, formSubmitData}, formCommands} = require('./shared');
const { PageTitle } = Corein.components.pageComponents;

var PageContent = (props) => {

    const { parameters, title, description, indexUrl, urls} = props;

    return (
        <div>
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <PageTitle><a href={indexUrl || urls.index}>{title}</a></PageTitle>
                    {description}
                </div>
            </div>
            <SharedForm formName="create" commands={formCommands} formUrlData={parameters} formUrl={formUrl} formSubmitData={formSubmitData} />
        </div>
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};