const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const { connect, Provider } = require('react-redux');
const { Row, Col, Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {index, create, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        <div>
            <PageAlerts />
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <h3><a href={index.url}>{title}</a></h3>
                </div>
                <div className="pull-left ml-1">
                    <a className="btn btn-outline-secondary" href={create.url}>Create new</a>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Row>
                        <Col md="8" className="card-text">
                            <div>
                                {description && ` ${description}`}
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="form-language">
                                <div className="pull-right ml-q">
                                    <Button className="btn btn-secondary">OK</Button>
                                </div>
                                <div className="pull-right" >
                                    <Input type="select">
                                        <option value="vi-VN">Tiếng Việt</option>
                                    </Input>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBlock>
                    <Form formName="update"
                        formUrl={formUrl}
                        formUrlData={parameters}
                        formSubmitData={formSubmitData}
                    />
                </CardBlock>
            </Card>
        </div>
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
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};