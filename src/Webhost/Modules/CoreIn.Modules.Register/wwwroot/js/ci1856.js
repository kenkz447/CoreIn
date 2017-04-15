(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿const React = require('react');
const {reduxForm, Field} = require('redux-form');
const {FormFeedback, FormGroup, Label, Button, Input, InputGroup, InputGroupAddon, Alert} = require('reactstrap');
const {SubmissionError} = require('redux-form');
const FlipCard = require('react-flipcard');
const $ = require('jquery');
const corein = require('corein');
const renderField = require('corein').renderField;

const submit = require('./submit').registerSubmit;

const registerForm = (props) => {
    const { error, handleSubmit, pristine, reset, submitting, submitSucceeded, fields, display, resources } = props;

    const formFields = [];

    $.map(fields, (props, index) => {
        const {input: {name, value}, display} = props;
        formFields.push(React.createElement(Field, {key: index, component: renderField, name: name, value: value, display: display}));
    });

    return (
        React.createElement("div", {id: "RegisterForm"}, 
            React.createElement(FlipCard, {disabled: true, flipped: submitSucceeded}, 
                React.createElement("div", {className: "card"}, 
                    React.createElement("form", {onSubmit: handleSubmit(submit), className: "card-block"}, 
                        React.createElement("h1", null, display.title), 
                        React.createElement("p", {className: "text-muted"}, display.description), 
                        !submitting && (error && React.createElement(Alert, {color: "danger"}, error)), 
                        formFields, 
                        React.createElement("div", null, 
                            React.createElement(Button, {type: "submit", disabled: submitting}, display.submitLabel ? display.submitLabel : "Submit")
                        )
                    )
                ), 
                React.createElement("div", {className: "card"}, 
                    React.createElement("div", {className: "card-block d-flex align-items-center"}, 
                        React.createElement("div", {className: "flex-column text-center"}, 
                            React.createElement("div", null, 
                                React.createElement("h3", null, display.successMessageTitle), 
                                React.createElement("p", null, display.successMessage)
                            ), 
                            React.createElement("a", {href: global.registerSuccessReturnUrl, className: "btn btn-success mx-center"}, display.loginBtnLabel)
                        )
                    )
                )
            )
        )
    );
};

module.exports = registerForm

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./submit":2,"corein":7,"jquery":"XpFelZ","react":"b6Dds6","react-flipcard":11,"reactstrap":"jldOQ7","redux-form":"LVfYvK"}],2:[function(require,module,exports){
(function (global){
﻿var $ = require('jquery');
var {SubmissionError} = require('redux-form');

const registerRequest = data => new Promise((resolve, reject) =>
    $.ajax({
        url: 'register',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.result === "success") {
                resolve(response);
            }
            else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
)
function registerSubmit(values) {
    return registerRequest(values)
        .then((response) => {
            global.registerSuccessReturnUrl = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Login failed!' })
            }
        });
}

module.exports = {
    registerSubmit: registerSubmit
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],3:[function(require,module,exports){
(function (global){
﻿const React = require('react');
const Redux = require('redux');
const {Provider, connect} = require('react-redux');
const formReducer = require('redux-form').reducer;
const {validator} = require('corein');
const {reduxForm} = require('redux-form');

const RegisterForm = require('./components/registerForm');

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

const Register = (props) => {
    const {index: {forms: {default: {title, description, fields}}, resources: {successMessageTitle, successMessage, loginBtnLabel}}} = props;

    const formDisplay = {
        title,
        description,
        successMessageTitle,
        successMessage,
        loginBtnLabel  
    }

    const validate = validator(fields);

    var ReduxRegisterForm = reduxForm({ form: 'registerForm', validate })(RegisterForm);

    ReduxRegisterForm = connect(
        state => ({
            display: formDisplay,
            fields: fields
        })
    )(ReduxRegisterForm);

    return (
        React.createElement(Provider, {store: store}, 
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "Row"}, 
                    React.createElement("div", {className: "col-md-4 mx-auto mt-2 pull-xs-none"}, 
                        React.createElement(ReduxRegisterForm, null)
                    )
                )
            )
        )
        );
}

global.Register = Register;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/registerForm":1,"corein":7,"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],4:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());


},{}],5:[function(require,module,exports){
var React = require('react');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return ( 
        React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder}))
    )
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(InputGroup, null, 
                React.createElement(InputGroupAddon, {dangerouslySetInnerHTML: { __html: label}}), 
                React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName}))
            ), 
            prompt && React.createElement(FormText, {color: "muted"}, prompt), 
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox"})), 
                ' ' + placeholder
            )
        )
    );
}

const renderField = props => {
    const {display: {renderType}} = props;
    if (renderType === "inputgroup") {
        return RenderInputGroup(props);
    } else if (renderType === 'formgroup'){
        return RenderFormGroup(props);
    } else if (renderType === 'checkbox') {
        return RenderCheckBox(props);
    }
}

module.exports = renderField;

},{"react":"b6Dds6","reactstrap":"jldOQ7"}],6:[function(require,module,exports){
const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

const validator = validating => values => {
    const errors = {};

    for (var property in validating) {

        var fieldName = validating[property].input.name;

        var hasRequired = validating[property].validate.required;
        var typeRequired = validating[property].validate.type;
        var minLengthRequired = validating[property].validate.minLength;
        var maxLengthRequired = validating[property].validate.maxLength;
        var hasCompare = validating[property].validate.compare;

        var hasContainLowercase = validating[property].validate.containLower;
        var hasContainUppercase = validating[property].validate.containUpper;
        var hasContainNumber = validating[property].validate.containNumber;
        var hasContainSpecialChar = validating[property].validate.containSpecial;

        if (hasRequired && hasRequired.value && !values[fieldName]) {
            errors[fieldName] = hasRequired.error;
        }
        else if (typeRequired && !isType(values[fieldName], typeRequired.value)) {
            errors[fieldName] = typeRequired.error;
        }
        else if (minLengthRequired && values[fieldName] && values[fieldName].length < minLengthRequired.value) {
            errors[fieldName] = minLengthRequired.error;
        }
        else if (hasCompare && values[fieldName] != values[hasCompare.value]) {
            errors[fieldName] = hasCompare.error;
        }
        else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainLowercase.error;
        }
        else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainUppercase.error;
        }
        else if (hasContainNumber && !/(?=.*[0-9])/.test(values[fieldName])) {
            errors[fieldName] = hasContainNumber.error;
        }
        else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[fieldName])) {
            errors[fieldName] = hasContainSpecialChar.error;
        }
    }

    return errors;
}

module.exports = validator

},{}],7:[function(require,module,exports){
var renderField = require('./components/formField.jsx');
var validator = require('./components/validator');

module.exports = {
    renderField,
    validator
};

},{"./components/formField.jsx":5,"./components/validator":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _helpersContains = require('../helpers/contains');

var _helpersContains2 = _interopRequireDefault(_helpersContains);

var _helpersInjectStyle = require('../helpers/injectStyle');

var _helpersInjectStyle2 = _interopRequireDefault(_helpersInjectStyle);

// Auto inject the styles (will only be done once)
(0, _helpersInjectStyle2['default'])();

exports['default'] = _react2['default'].createClass({
  displayName: 'ReactFlipCard',

  propTypes: {
    type: _react.PropTypes.string,
    flipped: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    onFlip: _react.PropTypes.func,
    onKeyDown: _react.PropTypes.func,
    children: function children(props, propName, componentName) {
      var prop = props[propName];

      if (_react2['default'].Children.count(prop) !== 2) {
        return new Error('`' + componentName + '` ' + 'should contain exactly two children. ' + 'The first child represents the front of the card. ' + 'The second child represents the back of the card.');
      }
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      type: 'horizontal',
      flipped: false,
      disabled: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      hasFocus: false,
      isFlipped: this.props.flipped
    };
  },

  componentDidMount: function componentDidMount() {
    this._hideFlippedSide();
  },

  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    var _this = this;

    // Make sure both sides are displayed for animation
    this._showBothSides();

    // Wait for display above to take effect
    setTimeout(function () {
      _this.setState({
        isFlipped: newProps.flipped
      });
    }, 0);
  },

  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
    // If card is flipping to back via props, track element for focus
    if (!this.props.flipped && nextProps.flipped) {
      // The element that focus will return to when flipped back to front
      this.focusElement = document.activeElement;
      // Indicates that the back of card needs focus
      this.focusBack = true;
    }

    // If isFlipped has changed need to notify
    if (this.state.isFlipped !== nextState.isFlipped) {
      this.notifyFlip = true;
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    // If card has flipped to front, and focus is still within the card
    // return focus to the element that triggered flipping to the back.
    if (!this.props.flipped && this.focusElement && (0, _helpersContains2['default'])((0, _reactDom.findDOMNode)(this), document.activeElement)) {
      this.focusElement.focus();
      this.focusElement = null;
    }
    // Direct focus to the back if needed
    /* eslint brace-style:0 */
    else if (this.focusBack) {
        this.refs.back.focus();
        this.focusBack = false;
      }

    // Notify card being flipped
    if (this.notifyFlip && typeof this.props.onFlip === 'function') {
      this.props.onFlip(this.state.isFlipped);
      this.notifyFlip = false;
    }

    // Hide whichever side of the card is down
    setTimeout(this._hideFlippedSide, 600);
  },

  handleFocus: function handleFocus() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: true
    });
  },

  handleBlur: function handleBlur() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: false
    });
  },

  handleKeyDown: function handleKeyDown(e) {
    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(e);
    }
  },

  render: function render() {
    return _react2['default'].createElement(
      'div',
      {
        className: (0, _classnames2['default'])({
          'ReactFlipCard': true,
          'ReactFlipCard--vertical': this.props.type === 'vertical',
          'ReactFlipCard--horizontal': this.props.type !== 'vertical',
          'ReactFlipCard--flipped': this.state.isFlipped,
          'ReactFlipCard--enabled': !this.props.disabled
        }),
        tabIndex: 0,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown
      },
      _react2['default'].createElement(
        'div',
        {
          className: 'ReactFlipCard__Flipper'
        },
        _react2['default'].createElement(
          'div',
          {
            className: 'ReactFlipCard__Front',
            ref: 'front',
            tabIndex: -1,
            'aria-hidden': this.state.isFlipped
          },
          this.props.children[0]
        ),
        _react2['default'].createElement(
          'div',
          {
            className: 'ReactFlipCard__Back',
            ref: 'back',
            tabIndex: -1,
            'aria-hidden': !this.state.isFlipped
          },
          this.props.children[1]
        )
      )
    );
  },

  _showBothSides: function _showBothSides() {
    this.refs.front.style.display = '';
    this.refs.back.style.display = '';
  },

  _hideFlippedSide: function _hideFlippedSide() {
    // This prevents the flipped side from being tabbable
    if (this.props.disabled) {
      if (this.state.isFlipped) {
        this.refs.front.style.display = 'none';
      } else {
        this.refs.back.style.display = 'none';
      }
    }
  }
});
module.exports = exports['default'];

},{"../helpers/contains":9,"../helpers/injectStyle":10,"classnames":4,"react":"b6Dds6","react-dom":"Ld8xHf"}],9:[function(require,module,exports){
// Checks to see if a parent element contains a child element
/* eslint no-param-reassign:0, no-cond-assign:0 */
"use strict";

module.exports = function contains(parent, child) {
  do {
    if (parent === child) {
      return true;
    }
  } while (child && (child = child.parentNode));
  return false;
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var CSS = '\n.ReactFlipCard {\n  -webkit-perspective: 1000;\n  -moz-perspective: 1000;\n  -ms-perspective: 1000;\n  perspective: 1000;\n\n  -ms-transform: perspective(1000px);\n  -moz-transform: perspective(1000px);\n  -moz-transform-style: preserve-3d;\n  -ms-transform-style: preserve-3d;\n\n  display: inline-block;\n}\n\n/* START: Accommodating for IE */\n.ReactFlipCard--enabled.ReactFlipCard:hover .ReactFlipCard__Back,\n.ReactFlipCard--flipped .ReactFlipCard__Back {\n  -webkit-transform: rotateY(0deg);\n  -moz-transform: rotateY(0deg);\n  -ms-transform: rotateY(0deg);\n  -o-transform: rotateY(0deg);\n  transform: rotateY(0deg);\n}\n\n.ReactFlipCard--enabled.ReactFlipCard:hover .ReactFlipCard__Front,\n.ReactFlipCard--flipped .ReactFlipCard__Front {\n  -webkit-transform: rotateY(180deg);\n  -moz-transform: rotateY(180deg);\n  -ms-transform: rotateY(180deg);\n  -o-transform: rotateY(180deg);\n  transform: rotateY(180deg);\n}\n/* END: Accommodating for IE */\n\n.ReactFlipCard__Flipper {\n  -webkit-transition: 0.6s;\n  -webkit-transform-style: preserve-3d;\n  -ms-transition: 0.6s;\n\n  -moz-transition: 0.6s;\n  -moz-transform: perspective(1000px);\n  -moz-transform-style: preserve-3d;\n  -ms-transform-style: preserve-3d;\n\n  transition: 0.6s;\n  transform-style: preserve-3d;\n\n  position: relative;\n}\n\n.ReactFlipCard__Front, .ReactFlipCard__Back {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n\n  -webkit-transition: 0.6s;\n  -webkit-transform-style: preserve-3d;\n  -webkit-transform: rotateY(0deg);\n\n  -moz-transition: 0.6s;\n  -moz-transform-style: preserve-3d;\n  -moz-transform: rotateY(0deg);\n\n  -o-transition: 0.6s;\n  -o-transform-style: preserve-3d;\n  -o-transform: rotateY(0deg);\n\n  -ms-transition: 0.6s;\n  -ms-transform-style: preserve-3d;\n  -ms-transform: rotateY(0deg);\n\n  transition: 0.6s;\n  transform-style: preserve-3d;\n  transform: rotateY(0deg);\n\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ReactFlipCard__Front {\n  -webkit-transform: rotateY(0deg);\n  -moz-transform: rotateY(0deg);\n  -ms-transform: rotateY(0deg);\n  -o-transform: rotateY(0deg);\n  z-index: 2;\n}\n\n.ReactFlipCard__Back {\n  -webkit-transform: rotateY(-180deg);\n  -moz-transform: rotateY(-180deg);\n  -ms-transform: rotateY(-180deg);\n  -o-transform: rotateY(-180deg);\n    transform: rotateY(-180deg);\n}\n\n/* vertical */\n.ReactFlipCard--vertical {\n  position: relative;\n}\n\n.ReactFlipCard--vertical .ReactFlipCard__Back {\n  -webkit-transform: rotateX(180deg);\n  -moz-transform: rotateX(180deg);\n  -ms-transform: rotateX(180deg);\n  -o-transform: rotateX(180deg);\n  transform: rotateX(180deg);\n}\n\n.ReactFlipCard--vertical .ReactFlipCard__Flipper {\n  -webkit-transform-origin: 100% 150px;\n  -moz-transform-origin: 100% 150px;\n  -ms-transform-origin: 100% 150px;\n  -o-transform-origin: 100% 150px;\n  transform-origin: 100% 150px;\n}\n\n/* START: Accommodating for IE */\n.ReactFlipCard--enabled.ReactFlipCard--vertical:hover .ReactFlipCard__Back,\n.ReactFlipCard--vertical.ReactFlipCard--flipped .ReactFlipCard__Back {\n  -webkit-transform: rotateX(0deg);\n  -moz-transform: rotateX(0deg);\n  -ms-transform: rotateX(0deg);\n  -o-transform: rotateX(0deg);\n  transform: rotateX(0deg);\n}\n\n.ReactFlipCard--enabled.ReactFlipCard--vertical:hover .ReactFlipCard__Front,\n.ReactFlipCard--vertical.ReactFlipCard--flipped .ReactFlipCard__Front {\n  -webkit-transform: rotateX(180deg);\n  -moz-transform: rotateX(180deg);\n  -ms-transform: rotateX(180deg);\n  -o-transform: rotateX(180deg);\n  transform: rotateX(180deg);\n}\n/* END: Accommodating for IE */\n';

exports['default'] = function () {
  var style = document.getElementById('react-flipcard-style');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('id', 'react-flipcard-style');
    var head = document.querySelector('head');
    head.insertBefore(style, head.firstChild);
  }
  style.innerHTML = CSS;
};

module.exports = exports['default'];

},{}],11:[function(require,module,exports){
'use strict';

module.exports = require('./components/FlipCard');

},{"./components/FlipCard":8}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxkZXZlbG9wXFxzY3JpcHRzXFxjb21wb25lbnRzXFxyZWdpc3RlckZvcm0uanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxkZXZlbG9wXFxzY3JpcHRzXFxjb21wb25lbnRzXFxzdWJtaXQuanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxkZXZlbG9wXFxzY3JpcHRzXFxpbmRleC5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xcY2xhc3NuYW1lc1xcaW5kZXguanMiLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xcY29yZWluXFxjb21wb25lbnRzXFxmb3JtRmllbGQuanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxub2RlX21vZHVsZXNcXGNvcmVpblxcY29tcG9uZW50c1xcdmFsaWRhdG9yLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxub2RlX21vZHVsZXNcXGNvcmVpblxcaW5kZXguanMiLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xccmVhY3QtZmxpcGNhcmRcXGxpYlxcY29tcG9uZW50c1xcRmxpcENhcmQuanMiLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xccmVhY3QtZmxpcGNhcmRcXGxpYlxcaGVscGVyc1xcY29udGFpbnMuanMiLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xccmVhY3QtZmxpcGNhcmRcXGxpYlxcaGVscGVyc1xcaW5qZWN0U3R5bGUuanMiLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXG5vZGVfbW9kdWxlc1xccmVhY3QtZmxpcGNhcmRcXGxpYlxcbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pELE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUss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SyxFQUFFO0lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztJQUNqRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUMzQztFQUNELEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7OztBQ2xCbkMsWUFBWSxDQUFDOztBQUViLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2NvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3Qge3JlZHV4Rm9ybSwgRmllbGR9ID0gcmVxdWlyZSgncmVkdXgtZm9ybScpO1xyXG5jb25zdCB7Rm9ybUZlZWRiYWNrLCBGb3JtR3JvdXAsIExhYmVsLCBCdXR0b24sIElucHV0LCBJbnB1dEdyb3VwLCBJbnB1dEdyb3VwQWRkb24sIEFsZXJ0fSA9IHJlcXVpcmUoJ3JlYWN0c3RyYXAnKTtcclxuY29uc3Qge1N1Ym1pc3Npb25FcnJvcn0gPSByZXF1aXJlKCdyZWR1eC1mb3JtJyk7XHJcbmNvbnN0IEZsaXBDYXJkID0gcmVxdWlyZSgncmVhY3QtZmxpcGNhcmQnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5jb25zdCBjb3JlaW4gPSByZXF1aXJlKCdjb3JlaW4nKTtcclxuY29uc3QgcmVuZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlaW4nKS5yZW5kZXJGaWVsZDtcclxuXHJcbmNvbnN0IHN1Ym1pdCA9IHJlcXVpcmUoJy4vc3VibWl0JykucmVnaXN0ZXJTdWJtaXQ7XHJcblxyXG5jb25zdCByZWdpc3RlckZvcm0gPSAocHJvcHMpID0+IHtcclxuICAgIGNvbnN0IHsgZXJyb3IsIGhhbmRsZVN1Ym1pdCwgcHJpc3RpbmUsIHJlc2V0LCBzdWJtaXR0aW5nLCBzdWJtaXRTdWNjZWVkZWQsIGZpZWxkcywgZGlzcGxheSwgcmVzb3VyY2VzIH0gPSBwcm9wcztcclxuXHJcbiAgICBjb25zdCBmb3JtRmllbGRzID0gW107XHJcblxyXG4gICAgJC5tYXAoZmllbGRzLCAocHJvcHMsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qge2lucHV0OiB7bmFtZSwgdmFsdWV9LCBkaXNwbGF5fSA9IHByb3BzO1xyXG4gICAgICAgIGZvcm1GaWVsZHMucHVzaCg8RmllbGQga2V5PXtpbmRleH0gY29tcG9uZW50PXtyZW5kZXJGaWVsZH0gbmFtZT17bmFtZX0gdmFsdWU9e3ZhbHVlfSBkaXNwbGF5PXtkaXNwbGF5fS8+KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBpZD1cIlJlZ2lzdGVyRm9ybVwiPlxyXG4gICAgICAgICAgICA8RmxpcENhcmQgZGlzYWJsZWQ9e3RydWV9IGZsaXBwZWQ9e3N1Ym1pdFN1Y2NlZWRlZH0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0KHN1Ym1pdCl9IGNsYXNzTmFtZT1cImNhcmQtYmxvY2tcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxPntkaXNwbGF5LnRpdGxlfTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbXV0ZWRcIj57ZGlzcGxheS5kZXNjcmlwdGlvbn08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHshc3VibWl0dGluZyAmJiAoZXJyb3IgJiYgPEFsZXJ0IGNvbG9yPVwiZGFuZ2VyXCI+e2Vycm9yfTwvQWxlcnQ+KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1GaWVsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17c3VibWl0dGluZ30+e2Rpc3BsYXkuc3VibWl0TGFiZWwgPyBkaXNwbGF5LnN1Ym1pdExhYmVsIDogXCJTdWJtaXRcIn08L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtYmxvY2sgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtY29sdW1uIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz57ZGlzcGxheS5zdWNjZXNzTWVzc2FnZVRpdGxlfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e2Rpc3BsYXkuc3VjY2Vzc01lc3NhZ2V9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtnbG9iYWwucmVnaXN0ZXJTdWNjZXNzUmV0dXJuVXJsfSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3MgbXgtY2VudGVyXCI+e2Rpc3BsYXkubG9naW5CdG5MYWJlbH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvRmxpcENhcmQ+IFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXJGb3JtIiwi77u/dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxudmFyIHtTdWJtaXNzaW9uRXJyb3J9ID0gcmVxdWlyZSgncmVkdXgtZm9ybScpO1xyXG5cclxuY29uc3QgcmVnaXN0ZXJSZXF1ZXN0ID0gZGF0YSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6ICdyZWdpc3RlcicsXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXG4pXG5mdW5jdGlvbiByZWdpc3RlclN1Ym1pdCh2YWx1ZXMpIHtcclxuICAgIHJldHVybiByZWdpc3RlclJlcXVlc3QodmFsdWVzKVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBnbG9iYWwucmVnaXN0ZXJTdWNjZXNzUmV0dXJuVXJsID0gcmVzcG9uc2UucmV0dXJuVXJsO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucmVzdWx0ICYmIHJlc3BvbnNlLnJlc3VsdCA9PT0gXCJlcnJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3VibWlzc2lvbkVycm9yKHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3VibWlzc2lvbkVycm9yKHsgX2Vycm9yOiAnTG9naW4gZmFpbGVkIScgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJlZ2lzdGVyU3VibWl0OiByZWdpc3RlclN1Ym1pdFxyXG59Iiwi77u/Y29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBSZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XHJcbmNvbnN0IHtQcm92aWRlciwgY29ubmVjdH0gPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xyXG5jb25zdCBmb3JtUmVkdWNlciA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKS5yZWR1Y2VyO1xyXG5jb25zdCB7dmFsaWRhdG9yfSA9IHJlcXVpcmUoJ2NvcmVpbicpO1xyXG5jb25zdCB7cmVkdXhGb3JtfSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKTtcclxuXHJcbmNvbnN0IFJlZ2lzdGVyRm9ybSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yZWdpc3RlckZvcm0nKTtcclxuXHJcbmNvbnN0IHJlZHVjZXJzID0ge1xyXG4gICAgZm9ybTogZm9ybVJlZHVjZXJcclxufVxyXG5cclxuY29uc3QgcmVkdWNlciA9IFJlZHV4LmNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycyk7XHJcblxyXG5jb25zdCBzdG9yZSA9IFJlZHV4LmNyZWF0ZVN0b3JlKHJlZHVjZXIpO1xyXG5cclxuY29uc3QgUmVnaXN0ZXIgPSAocHJvcHMpID0+IHtcclxuICAgIGNvbnN0IHtpbmRleDoge2Zvcm1zOiB7ZGVmYXVsdDoge3RpdGxlLCBkZXNjcmlwdGlvbiwgZmllbGRzfX0sIHJlc291cmNlczoge3N1Y2Nlc3NNZXNzYWdlVGl0bGUsIHN1Y2Nlc3NNZXNzYWdlLCBsb2dpbkJ0bkxhYmVsfX19ID0gcHJvcHM7XHJcblxyXG4gICAgY29uc3QgZm9ybURpc3BsYXkgPSB7XHJcbiAgICAgICAgdGl0bGUsXHJcbiAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgc3VjY2Vzc01lc3NhZ2VUaXRsZSxcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZSxcclxuICAgICAgICBsb2dpbkJ0bkxhYmVsICBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZSA9IHZhbGlkYXRvcihmaWVsZHMpO1xyXG5cclxuICAgIHZhciBSZWR1eFJlZ2lzdGVyRm9ybSA9IHJlZHV4Rm9ybSh7IGZvcm06ICdyZWdpc3RlckZvcm0nLCB2YWxpZGF0ZSB9KShSZWdpc3RlckZvcm0pO1xyXG5cclxuICAgIFJlZHV4UmVnaXN0ZXJGb3JtID0gY29ubmVjdChcclxuICAgICAgICBzdGF0ZSA9PiAoe1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmb3JtRGlzcGxheSxcclxuICAgICAgICAgICAgZmllbGRzOiBmaWVsZHNcclxuICAgICAgICB9KVxyXG4gICAgKShSZWR1eFJlZ2lzdGVyRm9ybSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNCBteC1hdXRvIG10LTIgcHVsbC14cy1ub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxSZWR1eFJlZ2lzdGVyRm9ybS8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9Qcm92aWRlcj5cclxuICAgICAgICApO1xyXG59XHJcblxyXG5nbG9iYWwuUmVnaXN0ZXIgPSBSZWdpc3RlcjsiLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIu+7v3ZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciB7SW5wdXQsIElucHV0R3JvdXAsIElucHV0R3JvdXBBZGRvbiwgRm9ybUZlZWRiYWNrLCBGb3JtR3JvdXAsIEZvcm1UZXh0LCBMYWJlbH0gPSByZXF1aXJlKCdyZWFjdHN0cmFwJyk7XHJcblxyXG5jb25zdCBSZW5kZXJJbnB1dCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBpZCwgdHlwZSwgcGxhY2Vob2xkZXIsIHZhbGlkYXRpb25TdGF0ZX0gPSBwcm9wcztcclxuXHJcbiAgICByZXR1cm4gKCBcclxuICAgICAgICA8SW5wdXQgey4uLmlucHV0fSBpZD17aWR9IHN0YXRlPXt2YWxpZGF0aW9uU3RhdGV9IHR5cGU9e3R5cGV9IHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gLz5cclxuICAgIClcclxufVxyXG5cclxuY29uc3QgUmVuZGVySW5wdXRHcm91cCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBkaXNwbGF5OiB7aWQsIHR5cGUsIGxhYmVsLCBkaXNwbGF5TmFtZSwgcGxhY2Vob2xkZXIsIHByb21wdH0sIG1ldGE6IHt0b3VjaGVkLCBlcnJvciwgd2FybmluZ319ID0gcHJvcHM7XHJcblxyXG4gICAgdmFyIHZhbGlkYXRpb25TdGF0ZSA9IHRvdWNoZWQgPyAoZXJyb3IgPyAnZGFuZ2VyJyA6ICh3YXJuaW5nID8gJ3dhcm5pbmcnIDogJ3N1Y2Nlc3MnKSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Rm9ybUdyb3VwIGNvbG9yPXt2YWxpZGF0aW9uU3RhdGV9IGNsYXNzTmFtZT1cIm1iLTFcIj5cclxuICAgICAgICAgICAgPElucHV0R3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8SW5wdXRHcm91cEFkZG9uIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogbGFiZWwgfX0gLz5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCB7Li4uaW5wdXR9IGlkPXtpZH0gc3RhdGU9e3ZhbGlkYXRpb25TdGF0ZX0gdHlwZT17dHlwZX0gcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyID8gcGxhY2Vob2xkZXIgOiBkaXNwbGF5TmFtZX0gLz5cclxuICAgICAgICAgICAgPC9JbnB1dEdyb3VwPlxyXG4gICAgICAgICAgICB7cHJvbXB0ICYmIDxGb3JtVGV4dCBjb2xvcj1cIm11dGVkXCI+e3Byb21wdH08L0Zvcm1UZXh0Pn1cclxuICAgICAgICAgICAge3RvdWNoZWQgJiYgKChlcnJvciAmJiA8Rm9ybUZlZWRiYWNrPntlcnJvcn08L0Zvcm1GZWVkYmFjaz4pIHx8ICh3YXJuaW5nICYmIDxGb3JtRmVlZGJhY2s+e3dhcm5pbmd9PC9Gb3JtRmVlZGJhY2s+KSl9XHJcbiAgICAgICAgPC9Gb3JtR3JvdXA+XHJcbiAgICApO1xyXG59XHJcblxyXG5jb25zdCBSZW5kZXJDaGVja0JveCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBkaXNwbGF5OiB7aWQsIHBsYWNlaG9sZGVyfX0gPSBwcm9wcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPEZvcm1Hcm91cCBjaGVjaz5cclxuICAgICAgICAgICAgPExhYmVsIGNoZWNrPlxyXG4gICAgICAgICAgICAgICAgPElucHV0IHsuLi5pbnB1dH0gaWQ9e2lkfSB0eXBlPVwiY2hlY2tib3hcIiAvPlxyXG4gICAgICAgICAgICAgICAgeycgJyArIHBsYWNlaG9sZGVyfVxyXG4gICAgICAgICAgICA8L0xhYmVsPlxyXG4gICAgICAgIDwvRm9ybUdyb3VwPlxyXG4gICAgKTtcclxufVxyXG5cclxuY29uc3QgcmVuZGVyRmllbGQgPSBwcm9wcyA9PiB7XHJcbiAgICBjb25zdCB7ZGlzcGxheToge3JlbmRlclR5cGV9fSA9IHByb3BzO1xyXG4gICAgaWYgKHJlbmRlclR5cGUgPT09IFwiaW5wdXRncm91cFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlbmRlcklucHV0R3JvdXAocHJvcHMpO1xyXG4gICAgfSBlbHNlIGlmIChyZW5kZXJUeXBlID09PSAnZm9ybWdyb3VwJyl7XHJcbiAgICAgICAgcmV0dXJuIFJlbmRlckZvcm1Hcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVyQ2hlY2tCb3gocHJvcHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckZpZWxkOyIsIu+7v2NvbnN0IGlzVHlwZSA9ICh2YWx1ZSwgdHlwZSkgPT4ge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnZW1haWwnOlxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJiYgL15bQS1aMC05Ll8lKy1dK0BbQS1aMC05Li1dK1xcLltBLVpdezIsNH0kL2kudGVzdCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmNvbnN0IHZhbGlkYXRvciA9IHZhbGlkYXRpbmcgPT4gdmFsdWVzID0+IHtcclxuICAgIGNvbnN0IGVycm9ycyA9IHt9O1xyXG5cclxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHZhbGlkYXRpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIGZpZWxkTmFtZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLmlucHV0Lm5hbWU7XHJcblxyXG4gICAgICAgIHZhciBoYXNSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLnJlcXVpcmVkO1xyXG4gICAgICAgIHZhciB0eXBlUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS50eXBlO1xyXG4gICAgICAgIHZhciBtaW5MZW5ndGhSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLm1pbkxlbmd0aDtcclxuICAgICAgICB2YXIgbWF4TGVuZ3RoUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5tYXhMZW5ndGg7XHJcbiAgICAgICAgdmFyIGhhc0NvbXBhcmUgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb21wYXJlO1xyXG5cclxuICAgICAgICB2YXIgaGFzQ29udGFpbkxvd2VyY2FzZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5Mb3dlcjtcclxuICAgICAgICB2YXIgaGFzQ29udGFpblVwcGVyY2FzZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5VcHBlcjtcclxuICAgICAgICB2YXIgaGFzQ29udGFpbk51bWJlciA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5OdW1iZXI7XHJcbiAgICAgICAgdmFyIGhhc0NvbnRhaW5TcGVjaWFsQ2hhciA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5TcGVjaWFsO1xyXG5cclxuICAgICAgICBpZiAoaGFzUmVxdWlyZWQgJiYgaGFzUmVxdWlyZWQudmFsdWUgJiYgIXZhbHVlc1tmaWVsZE5hbWVdKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzUmVxdWlyZWQuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVSZXF1aXJlZCAmJiAhaXNUeXBlKHZhbHVlc1tmaWVsZE5hbWVdLCB0eXBlUmVxdWlyZWQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gdHlwZVJlcXVpcmVkLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChtaW5MZW5ndGhSZXF1aXJlZCAmJiB2YWx1ZXNbZmllbGROYW1lXSAmJiB2YWx1ZXNbZmllbGROYW1lXS5sZW5ndGggPCBtaW5MZW5ndGhSZXF1aXJlZC52YWx1ZSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IG1pbkxlbmd0aFJlcXVpcmVkLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb21wYXJlICYmIHZhbHVlc1tmaWVsZE5hbWVdICE9IHZhbHVlc1toYXNDb21wYXJlLnZhbHVlXSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbXBhcmUuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5Mb3dlcmNhc2UgJiYgIS8oPz0uKlthLXpdKS8udGVzdCh2YWx1ZXNbZmllbGROYW1lXSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb250YWluTG93ZXJjYXNlLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb250YWluVXBwZXJjYXNlICYmICEvKD89LipbQS1aXSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpblVwcGVyY2FzZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29udGFpbk51bWJlciAmJiAhLyg/PS4qWzAtOV0pLy50ZXN0KHZhbHVlc1tmaWVsZE5hbWVdKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbnRhaW5OdW1iZXIuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5TcGVjaWFsQ2hhciAmJiAhLyg/PS4qWyFAIyQlXiYqXSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpblNwZWNpYWxDaGFyLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXJyb3JzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRvciIsIu+7v3ZhciByZW5kZXJGaWVsZCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9mb3JtRmllbGQuanN4Jyk7XHJcbnZhciB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdmFsaWRhdG9yJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJlbmRlckZpZWxkLFxyXG4gICAgdmFsaWRhdG9yXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcblxudmFyIF9jbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgX2NsYXNzbmFtZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NuYW1lcyk7XG5cbnZhciBfaGVscGVyc0NvbnRhaW5zID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb250YWlucycpO1xuXG52YXIgX2hlbHBlcnNDb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQ29udGFpbnMpO1xuXG52YXIgX2hlbHBlcnNJbmplY3RTdHlsZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaW5qZWN0U3R5bGUnKTtcblxudmFyIF9oZWxwZXJzSW5qZWN0U3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0luamVjdFN0eWxlKTtcblxuLy8gQXV0byBpbmplY3QgdGhlIHN0eWxlcyAod2lsbCBvbmx5IGJlIGRvbmUgb25jZSlcbigwLCBfaGVscGVyc0luamVjdFN0eWxlMlsnZGVmYXVsdCddKSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JlYWN0RmxpcENhcmQnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIHR5cGU6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZsaXBwZWQ6IF9yZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNhYmxlZDogX3JlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIG9uRmxpcDogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9uS2V5RG93bjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGNoaWxkcmVuOiBmdW5jdGlvbiBjaGlsZHJlbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgIHZhciBwcm9wID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLmNvdW50KHByb3ApICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2AnICsgY29tcG9uZW50TmFtZSArICdgICcgKyAnc2hvdWxkIGNvbnRhaW4gZXhhY3RseSB0d28gY2hpbGRyZW4uICcgKyAnVGhlIGZpcnN0IGNoaWxkIHJlcHJlc2VudHMgdGhlIGZyb250IG9mIHRoZSBjYXJkLiAnICsgJ1RoZSBzZWNvbmQgY2hpbGQgcmVwcmVzZW50cyB0aGUgYmFjayBvZiB0aGUgY2FyZC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdob3Jpem9udGFsJyxcbiAgICAgIGZsaXBwZWQ6IGZhbHNlLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGFzRm9jdXM6IGZhbHNlLFxuICAgICAgaXNGbGlwcGVkOiB0aGlzLnByb3BzLmZsaXBwZWRcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9oaWRlRmxpcHBlZFNpZGUoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIE1ha2Ugc3VyZSBib3RoIHNpZGVzIGFyZSBkaXNwbGF5ZWQgZm9yIGFuaW1hdGlvblxuICAgIHRoaXMuX3Nob3dCb3RoU2lkZXMoKTtcblxuICAgIC8vIFdhaXQgZm9yIGRpc3BsYXkgYWJvdmUgdG8gdGFrZSBlZmZlY3RcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNGbGlwcGVkOiBuZXdQcm9wcy5mbGlwcGVkXG4gICAgICB9KTtcbiAgICB9LCAwKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgLy8gSWYgY2FyZCBpcyBmbGlwcGluZyB0byBiYWNrIHZpYSBwcm9wcywgdHJhY2sgZWxlbWVudCBmb3IgZm9jdXNcbiAgICBpZiAoIXRoaXMucHJvcHMuZmxpcHBlZCAmJiBuZXh0UHJvcHMuZmxpcHBlZCkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgdGhhdCBmb2N1cyB3aWxsIHJldHVybiB0byB3aGVuIGZsaXBwZWQgYmFjayB0byBmcm9udFxuICAgICAgdGhpcy5mb2N1c0VsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgLy8gSW5kaWNhdGVzIHRoYXQgdGhlIGJhY2sgb2YgY2FyZCBuZWVkcyBmb2N1c1xuICAgICAgdGhpcy5mb2N1c0JhY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIGlzRmxpcHBlZCBoYXMgY2hhbmdlZCBuZWVkIHRvIG5vdGlmeVxuICAgIGlmICh0aGlzLnN0YXRlLmlzRmxpcHBlZCAhPT0gbmV4dFN0YXRlLmlzRmxpcHBlZCkge1xuICAgICAgdGhpcy5ub3RpZnlGbGlwID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gSWYgY2FyZCBoYXMgZmxpcHBlZCB0byBmcm9udCwgYW5kIGZvY3VzIGlzIHN0aWxsIHdpdGhpbiB0aGUgY2FyZFxuICAgIC8vIHJldHVybiBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCBmbGlwcGluZyB0byB0aGUgYmFjay5cbiAgICBpZiAoIXRoaXMucHJvcHMuZmxpcHBlZCAmJiB0aGlzLmZvY3VzRWxlbWVudCAmJiAoMCwgX2hlbHBlcnNDb250YWluczJbJ2RlZmF1bHQnXSkoKDAsIF9yZWFjdERvbS5maW5kRE9NTm9kZSkodGhpcyksIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0aGlzLmZvY3VzRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5mb2N1c0VsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBEaXJlY3QgZm9jdXMgdG8gdGhlIGJhY2sgaWYgbmVlZGVkXG4gICAgLyogZXNsaW50IGJyYWNlLXN0eWxlOjAgKi9cbiAgICBlbHNlIGlmICh0aGlzLmZvY3VzQmFjaykge1xuICAgICAgICB0aGlzLnJlZnMuYmFjay5mb2N1cygpO1xuICAgICAgICB0aGlzLmZvY3VzQmFjayA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgLy8gTm90aWZ5IGNhcmQgYmVpbmcgZmxpcHBlZFxuICAgIGlmICh0aGlzLm5vdGlmeUZsaXAgJiYgdHlwZW9mIHRoaXMucHJvcHMub25GbGlwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnByb3BzLm9uRmxpcCh0aGlzLnN0YXRlLmlzRmxpcHBlZCk7XG4gICAgICB0aGlzLm5vdGlmeUZsaXAgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHdoaWNoZXZlciBzaWRlIG9mIHRoZSBjYXJkIGlzIGRvd25cbiAgICBzZXRUaW1lb3V0KHRoaXMuX2hpZGVGbGlwcGVkU2lkZSwgNjAwKTtcbiAgfSxcblxuICBoYW5kbGVGb2N1czogZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZGlzYWJsZWQpIHJldHVybjtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNGbGlwcGVkOiB0cnVlXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlQmx1cjogZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0ZsaXBwZWQ6IGZhbHNlXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uS2V5RG93biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5wcm9wcy5vbktleURvd24oZSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICgwLCBfY2xhc3NuYW1lczJbJ2RlZmF1bHQnXSkoe1xuICAgICAgICAgICdSZWFjdEZsaXBDYXJkJzogdHJ1ZSxcbiAgICAgICAgICAnUmVhY3RGbGlwQ2FyZC0tdmVydGljYWwnOiB0aGlzLnByb3BzLnR5cGUgPT09ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgJ1JlYWN0RmxpcENhcmQtLWhvcml6b250YWwnOiB0aGlzLnByb3BzLnR5cGUgIT09ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgJ1JlYWN0RmxpcENhcmQtLWZsaXBwZWQnOiB0aGlzLnN0YXRlLmlzRmxpcHBlZCxcbiAgICAgICAgICAnUmVhY3RGbGlwQ2FyZC0tZW5hYmxlZCc6ICF0aGlzLnByb3BzLmRpc2FibGVkXG4gICAgICAgIH0pLFxuICAgICAgICB0YWJJbmRleDogMCxcbiAgICAgICAgb25Gb2N1czogdGhpcy5oYW5kbGVGb2N1cyxcbiAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRsZUJsdXIsXG4gICAgICAgIG9uS2V5RG93bjogdGhpcy5oYW5kbGVLZXlEb3duXG4gICAgICB9LFxuICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fRmxpcHBlcidcbiAgICAgICAgfSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fRnJvbnQnLFxuICAgICAgICAgICAgcmVmOiAnZnJvbnQnLFxuICAgICAgICAgICAgdGFiSW5kZXg6IC0xLFxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogdGhpcy5zdGF0ZS5pc0ZsaXBwZWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5bMF1cbiAgICAgICAgKSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fQmFjaycsXG4gICAgICAgICAgICByZWY6ICdiYWNrJyxcbiAgICAgICAgICAgIHRhYkluZGV4OiAtMSxcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICF0aGlzLnN0YXRlLmlzRmxpcHBlZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblsxXVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBfc2hvd0JvdGhTaWRlczogZnVuY3Rpb24gX3Nob3dCb3RoU2lkZXMoKSB7XG4gICAgdGhpcy5yZWZzLmZyb250LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB0aGlzLnJlZnMuYmFjay5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gIH0sXG5cbiAgX2hpZGVGbGlwcGVkU2lkZTogZnVuY3Rpb24gX2hpZGVGbGlwcGVkU2lkZSgpIHtcbiAgICAvLyBUaGlzIHByZXZlbnRzIHRoZSBmbGlwcGVkIHNpZGUgZnJvbSBiZWluZyB0YWJiYWJsZVxuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc0ZsaXBwZWQpIHtcbiAgICAgICAgdGhpcy5yZWZzLmZyb250LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlZnMuYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvLyBDaGVja3MgdG8gc2VlIGlmIGEgcGFyZW50IGVsZW1lbnQgY29udGFpbnMgYSBjaGlsZCBlbGVtZW50XG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCwgbm8tY29uZC1hc3NpZ246MCAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICBkbyB7XG4gICAgaWYgKHBhcmVudCA9PT0gY2hpbGQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSB3aGlsZSAoY2hpbGQgJiYgKGNoaWxkID0gY2hpbGQucGFyZW50Tm9kZSkpO1xuICByZXR1cm4gZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgQ1NTID0gJ1xcbi5SZWFjdEZsaXBDYXJkIHtcXG4gIC13ZWJraXQtcGVyc3BlY3RpdmU6IDEwMDA7XFxuICAtbW96LXBlcnNwZWN0aXZlOiAxMDAwO1xcbiAgLW1zLXBlcnNwZWN0aXZlOiAxMDAwO1xcbiAgcGVyc3BlY3RpdmU6IDEwMDA7XFxuXFxuICAtbXMtdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDAwcHgpO1xcbiAgLW1vei10cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMDBweCk7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG5cXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLyogU1RBUlQ6IEFjY29tbW9kYXRpbmcgZm9yIElFICovXFxuLlJlYWN0RmxpcENhcmQtLWVuYWJsZWQuUmVhY3RGbGlwQ2FyZDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fQmFjayxcXG4uUmVhY3RGbGlwQ2FyZC0tZmxpcHBlZCAuUmVhY3RGbGlwQ2FyZF9fQmFjayB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1tb3otdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1vLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLWVuYWJsZWQuUmVhY3RGbGlwQ2FyZDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fRnJvbnQsXFxuLlJlYWN0RmxpcENhcmQtLWZsaXBwZWQgLlJlYWN0RmxpcENhcmRfX0Zyb250IHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG59XFxuLyogRU5EOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcblxcbi5SZWFjdEZsaXBDYXJkX19GbGlwcGVyIHtcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogMC42cztcXG4gIC13ZWJraXQtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIC1tcy10cmFuc2l0aW9uOiAwLjZzO1xcblxcbiAgLW1vei10cmFuc2l0aW9uOiAwLjZzO1xcbiAgLW1vei10cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMDBweCk7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG5cXG4gIHRyYW5zaXRpb246IDAuNnM7XFxuICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcblxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uUmVhY3RGbGlwQ2FyZF9fRnJvbnQsIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgLW1vei1iYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XFxuICAtbXMtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcblxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjZzO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuXFxuICAtbW96LXRyYW5zaXRpb246IDAuNnM7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG5cXG4gIC1vLXRyYW5zaXRpb246IDAuNnM7XFxuICAtby10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcblxcbiAgLW1zLXRyYW5zaXRpb246IDAuNnM7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIC1tcy10cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuXFxuICB0cmFuc2l0aW9uOiAwLjZzO1xcbiAgdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG5cXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxufVxcblxcbi5SZWFjdEZsaXBDYXJkX19Gcm9udCB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1tb3otdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1vLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIHotaW5kZXg6IDI7XFxufVxcblxcbi5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZVkoLTE4MGRlZyk7XFxuICAtbXMtdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoLTE4MGRlZyk7XFxufVxcblxcbi8qIHZlcnRpY2FsICovXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIC5SZWFjdEZsaXBDYXJkX19GbGlwcGVyIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIC1tb3otdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIC1tcy10cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDE1MHB4O1xcbiAgLW8tdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTUwcHg7XFxufVxcblxcbi8qIFNUQVJUOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcbi5SZWFjdEZsaXBDYXJkLS1lbmFibGVkLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsOmhvdmVyIC5SZWFjdEZsaXBDYXJkX19CYWNrLFxcbi5SZWFjdEZsaXBDYXJkLS12ZXJ0aWNhbC5SZWFjdEZsaXBDYXJkLS1mbGlwcGVkIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XFxuICAtbXMtdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbn1cXG5cXG4uUmVhY3RGbGlwQ2FyZC0tZW5hYmxlZC5SZWFjdEZsaXBDYXJkLS12ZXJ0aWNhbDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fRnJvbnQsXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsLlJlYWN0RmxpcENhcmQtLWZsaXBwZWQgLlJlYWN0RmxpcENhcmRfX0Zyb250IHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKTtcXG59XFxuLyogRU5EOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcbic7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWZsaXBjYXJkLXN0eWxlJyk7XG4gIGlmICghc3R5bGUpIHtcbiAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKCdpZCcsICdyZWFjdC1mbGlwY2FyZC1zdHlsZScpO1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpO1xuICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICB9XG4gIHN0eWxlLmlubmVySFRNTCA9IENTUztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvRmxpcENhcmQnKTsiXX0=
