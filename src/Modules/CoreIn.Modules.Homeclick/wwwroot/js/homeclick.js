(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿global.Homeclick = {
    project: require('./homeclick/project'),
    collection: require('./homeclick/collection'),
    post: require('./homeclick/post'),
    optionGroup: require('./homeclick/option-group'),
    construction: require('./homeclick/construction'),
    page: require('./homeclick/page')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./homeclick/collection":2,"./homeclick/construction":12,"./homeclick/option-group":22,"./homeclick/page":27,"./homeclick/post":37,"./homeclick/project":47}],2:[function(require,module,exports){
const index = require('./collection/index');
const create = require('./collection/create');
const update = require('./collection/update');

module.exports = {
    index,
    create,
    update
}

},{"./collection/create":3,"./collection/index":4,"./collection/update":11}],3:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":7,"./shared/components/form":8,"./shared/redux/reducer":10,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],4:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const { createNewUrl, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, null)
        )
    );
};

},{"./index/components/table":5,"./index/redux/reducer":6,"./shared":7,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],5:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],6:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],7:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'collection';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnail',
            render: row => (React.createElement("div", null, React.createElement("img", {className: "table-thumbnail", src: row.value}))),
            width: 160,
            sortable: false,
            hideFilter: true
        }, {
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],8:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement(form.default, React.__spread({},  reduxFormProps))
            )
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],9:[function(require,module,exports){
module.exports = {
};

},{}],10:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
});

},{"../components/form":8,"./keys":9,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],11:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {createNewUrl, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formUrlData: parameters, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":7,"./shared/components/form":8,"./shared/redux/reducer":10,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],12:[function(require,module,exports){
const index = require('./construction/index');
const create = require('./construction/create');
const update = require('./construction/update');

module.exports = {
    index,
    create,
    update
}

},{"./construction/create":13,"./construction/index":14,"./construction/update":21}],13:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":17,"./shared/components/form":18,"./shared/redux/reducer":20,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],14:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const { createNewUrl, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, null)
        )
    );
};

},{"./index/components/table":15,"./index/redux/reducer":16,"./shared":17,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],15:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],16:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],17:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'construction';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnail',
            render: row => (React.createElement("div", null, React.createElement("img", {className: "table-thumbnail", src: row.value}))),
            width: 160,
            sortable: false,
            hideFilter: true
        }, {
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],18:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement(form.default, React.__spread({},  reduxFormProps))
            )
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],19:[function(require,module,exports){
module.exports = {
};

},{}],20:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
});

},{"../components/form":18,"./keys":19,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],21:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {createNewUrl, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formUrlData: parameters, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":17,"./shared/components/form":18,"./shared/redux/reducer":20,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],22:[function(require,module,exports){
const index = require('./option-group/index');
const create = require('./option-group/create');
const update = require('./option-group/update');

module.exports = {
    index,
    create,
    update
}

},{"./option-group/create":23,"./option-group/index":24,"./option-group/update":26}],23:[function(require,module,exports){
const $ = require('jquery');

const { index, create: {formUrl, formSubmitData}} = require('./shared');

const Page = Corein.pageTemplates.create;

module.exports = (props) => {
    const pageProps = $.extend(true, { formUrl, formSubmitData, indexUrl: index.url }, props);

    return (
        React.createElement(Page, React.__spread({},  pageProps))
    );
};

},{"./shared":25,"jquery":"XpFelZ"}],24:[function(require,module,exports){
const Index = Corein.pageTemplates.index;
const { create, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

module.exports = (props) => {
    const { title } = props;

    return (
        React.createElement(Index, {title: title, createNewUrl: create.url, dataUrl: dataUrl, deleteUrl: deleteUrl, tableColumns: tableColumns})
    );
};

},{"./shared":25}],25:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'optiongroup';

module.exports = {
    index: {
        url: `/${mvcController}/index`,
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        url: `/${mvcController}/create`,
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],26:[function(require,module,exports){
const $ = require('jquery');
const Page = Corein.pageTemplates.update;

const { create, index, update: {formUrl, formSubmitData}} = require('./shared');

module.exports = (props) => {
    const pageProps = $.extend(true, {
        createNewUrl: create.url,
        indexUrl: index.url,
        formUrl,
        formSubmitData
    }, props);

    return (
        React.createElement(Page, React.__spread({},  pageProps))
    );
};

},{"./shared":25,"jquery":"XpFelZ"}],27:[function(require,module,exports){
const index = require('./page/index');
const create = require('./page/create');
const update = require('./page/update');

module.exports = {
    index,
    create,
    update
}

},{"./page/create":28,"./page/index":29,"./page/update":36}],28:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":32,"./shared/components/form":33,"./shared/redux/reducer":35,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],29:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const { createNewUrl, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows, title } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement("div", {className: "clearfix mb-h"}, 
                React.createElement("div", {className: "pull-left"}, 
                    React.createElement("h2", null,  title )
                ), 
                React.createElement("div", {className: "pull-right"}, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./index/components/table":30,"./index/redux/reducer":31,"./shared":32,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],30:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],31:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],32:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'page';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],33:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement(form.default, React.__spread({},  reduxFormProps))
            )
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],34:[function(require,module,exports){
module.exports = {
};

},{}],35:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
});

},{"../components/form":33,"./keys":34,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],36:[function(require,module,exports){
const $ = require('jquery');
const Page = Corein.pageTemplates.update;

const { createNewUrl, update: { formUrl, formSubmitData } } = require('./shared');

module.exports = (props) => {
    const pageProps = $.extend(true, { createNewUrl, formUrl, formSubmitData }, props);

    return (
        React.createElement(Page, React.__spread({},  pageProps))
    );
};

},{"./shared":32,"jquery":"XpFelZ"}],37:[function(require,module,exports){
const index = require('./post/index');
const create = require('./post/create');
const update = require('./post/update');

module.exports = {
    index,
    create,
    update
}

},{"./post/create":38,"./post/index":39,"./post/update":46}],38:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":42,"./shared/components/form":43,"./shared/redux/reducer":45,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],39:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const { createNewUrl, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, null)
        )
    );
};

},{"./index/components/table":40,"./index/redux/reducer":41,"./shared":42,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],40:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],41:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],42:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'post';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnail',
            render: row => (React.createElement("div", null, React.createElement("img", {className: "table-thumbnail", src: row.value}))),
            width: 160,
            sortable: false,
            hideFilter: true
        }, {
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],43:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement(form.default, React.__spread({},  reduxFormProps))
            )
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],44:[function(require,module,exports){
module.exports = {
};

},{}],45:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
});

},{"../components/form":43,"./keys":44,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],46:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {createNewUrl, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formUrlData: parameters, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":42,"./shared/components/form":43,"./shared/redux/reducer":45,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],47:[function(require,module,exports){
const index = require('./project/index');
const create = require('./project/create');
const update = require('./project/update');

module.exports = {
    index,
    create,
    update
}

},{"./project/create":48,"./project/index":49,"./project/update":57}],48:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":52,"./shared/components/form":53,"./shared/redux/reducer":56,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],49:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const { createNewUrl, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
                )
            )
        )
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
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, null)
        )
    );
};

},{"./index/components/table":50,"./index/redux/reducer":51,"./shared":52,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],50:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],51:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],52:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'project';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnail',
            render: row => (React.createElement("div", null, React.createElement("img", {className: "table-thumbnail", src: row.value}))),
            width: 160,
            sortable: false,
            hideFilter: true
        }, {
            header: "Title",
            accessor: 'title',
            render: row => (React.createElement("div", null, React.createElement("a", {href: `/${mvcController}/update/${row.rowValues.id}`, target: "blank"}, row.value))),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}

},{"jquery":"XpFelZ"}],53:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');
const alerts = Corein.components.pageAlerts;

const LayoutModal = require('./layout-modal').default;
const { openLayoutModal } = require('./layout-modal').actions;

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        const { openLayoutModal } = this.props;

        return {
            SET_LAYOUT: (formValues, fieldData) => {
                var roomName = fieldData.input.name.split('.')[1];

                const roomArrayIndex = /\[([^]+)\]/.exec(roomName)[1];
                const room = formValues.details['rooms'][roomArrayIndex];
                const layoutImage = room.layoutimage;
                if (layoutImage)
                    openLayoutModal(layoutImage, fieldData.input.value, fieldData.input.onChange, fieldData.fileManagerModalToggle);
            }
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: form.submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement(form.default, React.__spread({},  reduxFormProps)), 
                React.createElement(LayoutModal, null)
            )
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push, openLayoutModal }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"./layout-modal":54,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],54:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {Modal, ModalHeader, ModalBody, ModalFooter, Button} = require('reactstrap');

const Slider = require('rc-slider');

const keys = {
    toggle: 'TOGGLE',
    openLayoutModal: 'OPEN_LAYOUT_MODAL',
    addValue: 'ADD_VALUE',
    removeSelectedValue: 'REMOVE_VALUE',
    selectValueIndex: 'SELECT_VALUE_INDEX',
    updateValue: 'UPDATE_VALUE'
}

const actions = {
    toggle: () => ({
        type: keys.toggle
    }),

    openLayoutModal: (layoutImage, fieldValue, field_onChange, fileManagerModalToggle) => ({
        type: keys.openLayoutModal,
        layoutImage,
        fieldValue,
        field_onChange,
        fileManagerModalToggle
    }),

    addValue: (value) => ({
        type: keys.addValue,
        value
    }),

    removeSelectedValue: () => ({
        type: keys.removeSelectedValue
    }),

    selectValueIndex: (index) => ({
        type: keys.selectValueIndex,
        index
    }),

    updateValue: (value) => ({
        type: keys.updateValue,
        value
    })
}

const initialState = {
    values: [],
    isOpen: false,
    layoutImage: null,
    field_onChange: null,
    fileManagerModalToggle: null,
    selectedIndex: -1
}

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.toggle:
            newState.isOpen = !newState.isOpen;
            selectedIndex = -1;
            break;
        case keys.openLayoutModal:
            newState.layoutImage = action.layoutImage;
            newState.field_onChange = action.field_onChange;
            newState.fileManagerModalToggle = action.fileManagerModalToggle;

            newState.values = action.fieldValue ? JSON.parse(action.fieldValue) : [];

            newState.isOpen = true;
            break;
        case keys.addValue:
            newState.values.push(action.value);
            newState.selectedIndex = newState.values.length - 1;
            break;
        case keys.removeSelectedValue:
            newState.values.splice(newState.selectedIndex, 1);
            newState.selectedIndex = -1;
            break;
        case keys.selectValueIndex:
            newState.selectedIndex = action.index;
            break;
        case keys.updateValue:
            newState.values[newState.selectedIndex] = action.value;
            break;
        default:
            return state;
    }

    return newState;
}

class LayoutModal extends React.Component {
    constructor(props) {
        super(props);
        this.imageClick = this.imageClick.bind(this);
        this.okButtonClick = this.okButtonClick.bind(this);
        this.selectImgBtnClick = this.selectImgBtnClick.bind(this);
        this.deleteBtnClick = this.deleteBtnClick.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    imageClick(e) {
        const { addValue } = this.props;

        const $target = $(e.target);

        const currentImgSize = {
            w: $target.width(),
            h: $target.height()
        }

        const imgFileSize = {
            w: $target.prop('naturalWidth'),
            h: $target.prop('naturalHeight')
        }

        var offset_t = $target.offset().top - $(window).scrollTop();
        var offset_l = $target.offset().left - $(window).scrollLeft();

        var left = Math.round((e.clientX - offset_l));
        var top = Math.round((e.clientY - offset_t));

        var percX = (left / $target.width() * 100).toFixed(3);
        var percY = (top / $target.height() * 100).toFixed(3);

        addValue({ image: '', rotate: 0, x: percX, y: percY });
    }

    deleteBtnClick() {
        const { removeSelectedValue } = this.props;
        removeSelectedValue();
    }

    selectImgBtnClick() {

        const { values, selectedIndex, fileManagerModalToggle, toggle, updateValue } = this.props;

        fileManagerModalToggle((files) => {
            var file = files[0]

            if (!file)
                return;

            const selectedValue = values[selectedIndex];
            selectedValue.image = file.meta.src;
            updateValue(selectedValue);
        });
    }

    okButtonClick() {
        const {changeFieldValue, toggle, values} = this.props;

        toggle();
        changeFieldValue(JSON.stringify(values));
    }

    onSliderChange(e) {
        const { values, selectedIndex, updateValue } = this.props;

        const selectedValue = values[selectedIndex];
        selectedValue.rotate = e;
        updateValue(selectedValue);
    }

    render() {
        const {selectedIndex, values, layoutImage, toggle, isOpen, selectValueIndex, updateValue} = this.props;

        var selectedValue = values[selectedIndex];

        return (
            React.createElement(Modal, {className: "modal-lg", isOpen: isOpen, toggle: toggle}, 
                React.createElement(ModalHeader, {toggle: toggle}, "Modal title"), 
                React.createElement(ModalBody, null, 
                    React.createElement("div", {className: "layout-modal"}, 
                        React.createElement("div", {className: "arrow-container"}, 
                            React.createElement("img", {src: layoutImage, className: "w-100", onClick: this.imageClick}), 
                            
                                values.map((data, index) => {
                                    const divStyle = {
                                        transform: `rotate(${data.rotate}deg)`,
                                        left: `calc(${data.x}% - 10px)`,
                                        top: `calc(${data.y}% - 10px)`,
                                    };

                                    return (
                                        React.createElement("div", {key: index, style: divStyle, className: "arrow", onClick: () => { selectValueIndex(index); }}
                                            
                                        )
                                    );
                                })
                            
                        ), 
                        
                            selectedValue &&
                            React.createElement("div", {className: "controls", style: { left: 'calc(' + selectedValue.x + "% + 20px)", top: 'calc(' + selectedValue.y + "% - 0px)"}}, 
                                React.createElement(Button, {onClick: this.selectImgBtnClick}, 
                                    React.createElement("i", {className: "fa fa-picture-o", "aria-hidden": "true"})
                                ), 
                                React.createElement(Slider, {className: "slider", min: 0, max: 360, defaultValue: 3, value: selectedValue.rotate, 
                                    onChange: (e) => {
                                        selectedValue.rotate = e;
                                        updateValue(selectedValue);
                                    }}), 
                                React.createElement(Button, {onClick: this.deleteBtnClick}, 
                                    React.createElement("i", {className: "fa fa-times", "aria-hidden": "true"})
                                )
                            )
                        
                    )
                ), 
                React.createElement(ModalFooter, null, 
                    React.createElement(Button, {color: "secondary", onClick: this.okButtonClick}, "OK")
                )
            )
        )
    }
};

const stateToProps = (state) => {
    return {
        values: state.layoutModal.values,
        isOpen: state.layoutModal.isOpen,
        layoutImage: state.layoutModal.layoutImage,
        changeFieldValue: state.layoutModal.field_onChange,
        fileManagerModalToggle: state.layoutModal.fileManagerModalToggle,
        selectedIndex: state.layoutModal.selectedIndex,
    }
};

const reducerToProps = (reducer) => (
    bindActionCreators({ toggle: actions.toggle, addValue: actions.addValue, selectValueIndex: actions.selectValueIndex, removeSelectedValue: actions.removeSelectedValue, updateValue: actions.updateValue }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(LayoutModal),
    reducer,
    actions
}

},{"jquery":"XpFelZ","rc-slider":"6pHinT","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],55:[function(require,module,exports){
module.exports = {
};

},{}],56:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
    layoutModal: require('../components/layout-modal').reducer
});

},{"../components/form":53,"../components/layout-modal":54,"./keys":55,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],57:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {createNewUrl, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement("a", {className: "btn btn-primary", href: createNewUrl}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: formUrl, 
                        formUrlData: parameters, 
                        formSubmitData: formSubmitData}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"./shared":52,"./shared/components/form":53,"./shared/redux/reducer":56,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}]},{},[1])

//# sourceMappingURL=homeclick.js.map
