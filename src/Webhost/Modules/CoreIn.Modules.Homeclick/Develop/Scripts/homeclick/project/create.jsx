const $ = require('jquery');
const { combineReducers, createStore } = require('redux');
const { Provider } = require('react-redux');
const Form = require('./create/components/form');

const reducer = require('./create/redux/reducer');

const store = createStore(reducer);

const Page = (props) => {
    return (
        <Provider store={store}>
            <div>
                <div className="card">
                    <div className="card-block">
                        Title
                    </div>
                </div>
                <div className="card">
                    <div className="card-block">
                        <Form />
                    </div>
                </div>
            </div>
        </Provider>
        );
};

module.exports = Page;