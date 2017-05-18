(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿global.Admin = {
    register: require('./admin/register')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./admin/register":2}],2:[function(require,module,exports){
module.exports = {
    index: require('./register/index')
}

},{"./register/index":3}],3:[function(require,module,exports){
const React = require('react');
const Redux = require('redux');
const {Provider, connect} = require('react-redux');
const formReducer = require('redux-form').reducer;
const {reduxForm} = require('redux-form');

const RegisterForm = require('./index/components/register-form');

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

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

module.exports = (props) => {
    const {forms: {default: {title, description, fields}}, resources: {successMessageTitle, successMessage, loginBtnLabel}} = props;

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

},{"./index/components/register-form":4,"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],4:[function(require,module,exports){
(function (global){
﻿const React = require('react');
const {reduxForm, Field} = require('redux-form');
const {SubmissionError} = require('redux-form');
const FlipCard = require('react-flipcard');
const $ = require('jquery');

var {Button, Alert, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return (
        React.createElement(Input, React.__spread({}, input, { id: id, state: validationState, type: type, placeholder: placeholder }))
    )
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, { color: validationState, className: "mb-1" },
            React.createElement(InputGroup, null,
                React.createElement(InputGroupAddon, { dangerouslySetInnerHTML: { __html: label } }),
                React.createElement(Input, React.__spread({}, input, { id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName }))
            ),
            prompt && React.createElement(FormText, { color: "muted" }, prompt),
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, placeholder}} = props;
    return (
        React.createElement(FormGroup, { check: true },
            React.createElement(Label, { check: true },
                React.createElement(Input, React.__spread({}, input, { id: id, type: "checkbox" })),
                ' ' + placeholder
            )
        )
    );
}

const renderField = props => {
    const {display: {renderType}} = props;
    if (renderType === "inputgroup") {
        return RenderInputGroup(props);
    } else if (renderType === 'formgroup') {
        return RenderFormGroup(props);
    } else if (renderType === 'checkbox') {
        return RenderCheckBox(props);
    }
}

const submit = Corein.components.form.submit({
    url: 'register',
    method: 'POST',
    successAction: (response) => {
        global.registerSuccessReturnUrl = response.result;
    }
});

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
},{"jquery":"XpFelZ","react":"b6Dds6","react-flipcard":9,"reactstrap":"jldOQ7","redux-form":"LVfYvK"}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
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

},{"../helpers/contains":7,"../helpers/injectStyle":8,"classnames":5,"react":"b6Dds6","react-dom":"Ld8xHf"}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

module.exports = require('./components/FlipCard');

},{"./components/FlipCard":6}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxkZXZlbG9wXFxzY3JpcHRzXFxhZG1pbi5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXGRldmVsb3BcXHNjcmlwdHNcXGFkbWluXFxyZWdpc3Rlci5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuUmVnaXN0ZXJcXGRldmVsb3BcXHNjcmlwdHNcXGFkbWluXFxyZWdpc3RlclxcaW5kZXguanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLlJlZ2lzdGVyXFxkZXZlbG9wXFxzY3JpcHRzXFxhZG1pblxccmVnaXN0ZXJcXGluZGV4XFxjb21wb25lbnRzXFxyZWdpc3Rlci1mb3JtLmpzeCIsIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxjbGFzc25hbWVzXFxpbmRleC5qcyIsIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxyZWFjdC1mbGlwY2FyZFxcbGliXFxjb21wb25lbnRzXFxGbGlwQ2FyZC5qcyIsIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxyZWFjdC1mbGlwY2FyZFxcbGliXFxoZWxwZXJzXFxjb250YWlucy5qcyIsIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxyZWFjdC1mbGlwY2FyZFxcbGliXFxoZWxwZXJzXFxpbmplY3RTdHlsZS5qcyIsIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5SZWdpc3Rlclxcbm9kZV9tb2R1bGVzXFxyZWFjdC1mbGlwY2FyZFxcbGliXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHO0lBQ1osUUFBUSxFQUFFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7Ozs7O0FDRHpDLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNkLEtBQUssRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUM7Ozs7QUNEdEMsQ0FBQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFH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QUMsRUFBRTtFQUM5QyxPQUFPLEtBQUssQ0FBQztDQUNkOzs7QUNYRCxZQUFZLENBQUM7O0FBRWIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFO0VBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQyxDQUFDO0FBQ0gsSUFBSSxHQUFHLEdBQUcsa25IQUFrbkgsQ0FBQzs7QUFFN25ILE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFZO0VBQy9CLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQztFQUM1RCxJQUFJLENBQUMsS0FBSyxFQUFFO0lBQ1YsS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztJQUNqRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUMzQztFQUNELEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7OztBQ2xCbkMsWUFBWSxDQUFDOztBQUViLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2dsb2JhbC5BZG1pbiA9IHtcclxuICAgIHJlZ2lzdGVyOiByZXF1aXJlKCcuL2FkbWluL3JlZ2lzdGVyJylcclxufSIsIu+7v21vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5kZXg6IHJlcXVpcmUoJy4vcmVnaXN0ZXIvaW5kZXgnKVxyXG59Iiwi77u/Y29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5jb25zdCBSZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XHJcbmNvbnN0IHtQcm92aWRlciwgY29ubmVjdH0gPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xyXG5jb25zdCBmb3JtUmVkdWNlciA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKS5yZWR1Y2VyO1xyXG5jb25zdCB7cmVkdXhGb3JtfSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKTtcclxuXHJcbmNvbnN0IFJlZ2lzdGVyRm9ybSA9IHJlcXVpcmUoJy4vaW5kZXgvY29tcG9uZW50cy9yZWdpc3Rlci1mb3JtJyk7XHJcblxyXG5jb25zdCByZWR1Y2VycyA9IHtcclxuICAgIGZvcm06IGZvcm1SZWR1Y2VyXHJcbn1cclxuXHJcbmNvbnN0IHJlZHVjZXIgPSBSZWR1eC5jb21iaW5lUmVkdWNlcnMocmVkdWNlcnMpO1xyXG5cclxuY29uc3Qgc3RvcmUgPSBSZWR1eC5jcmVhdGVTdG9yZShyZWR1Y2VyKTtcclxuXHJcbmNvbnN0IGlzVHlwZSA9ICh2YWx1ZSwgdHlwZSkgPT4ge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnZW1haWwnOlxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgJiYgL15bQS1aMC05Ll8lKy1dK0BbQS1aMC05Li1dK1xcLltBLVpdezIsNH0kL2kudGVzdCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmNvbnN0IHZhbGlkYXRvciA9IHZhbGlkYXRpbmcgPT4gdmFsdWVzID0+IHtcclxuICAgIGNvbnN0IGVycm9ycyA9IHt9O1xyXG5cclxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHZhbGlkYXRpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIGZpZWxkTmFtZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLmlucHV0Lm5hbWU7XHJcblxyXG4gICAgICAgIHZhciBoYXNSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLnJlcXVpcmVkO1xyXG4gICAgICAgIHZhciB0eXBlUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS50eXBlO1xyXG4gICAgICAgIHZhciBtaW5MZW5ndGhSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLm1pbkxlbmd0aDtcclxuICAgICAgICB2YXIgbWF4TGVuZ3RoUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5tYXhMZW5ndGg7XHJcbiAgICAgICAgdmFyIGhhc0NvbXBhcmUgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb21wYXJlO1xyXG5cclxuICAgICAgICB2YXIgaGFzQ29udGFpbkxvd2VyY2FzZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5Mb3dlcjtcclxuICAgICAgICB2YXIgaGFzQ29udGFpblVwcGVyY2FzZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5VcHBlcjtcclxuICAgICAgICB2YXIgaGFzQ29udGFpbk51bWJlciA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5OdW1iZXI7XHJcbiAgICAgICAgdmFyIGhhc0NvbnRhaW5TcGVjaWFsQ2hhciA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbnRhaW5TcGVjaWFsO1xyXG5cclxuICAgICAgICBpZiAoaGFzUmVxdWlyZWQgJiYgaGFzUmVxdWlyZWQudmFsdWUgJiYgIXZhbHVlc1tmaWVsZE5hbWVdKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzUmVxdWlyZWQuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVSZXF1aXJlZCAmJiAhaXNUeXBlKHZhbHVlc1tmaWVsZE5hbWVdLCB0eXBlUmVxdWlyZWQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gdHlwZVJlcXVpcmVkLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChtaW5MZW5ndGhSZXF1aXJlZCAmJiB2YWx1ZXNbZmllbGROYW1lXSAmJiB2YWx1ZXNbZmllbGROYW1lXS5sZW5ndGggPCBtaW5MZW5ndGhSZXF1aXJlZC52YWx1ZSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IG1pbkxlbmd0aFJlcXVpcmVkLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb21wYXJlICYmIHZhbHVlc1tmaWVsZE5hbWVdICE9IHZhbHVlc1toYXNDb21wYXJlLnZhbHVlXSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbXBhcmUuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5Mb3dlcmNhc2UgJiYgIS8oPz0uKlthLXpdKS8udGVzdCh2YWx1ZXNbZmllbGROYW1lXSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb250YWluTG93ZXJjYXNlLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb250YWluVXBwZXJjYXNlICYmICEvKD89LipbQS1aXSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpblVwcGVyY2FzZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29udGFpbk51bWJlciAmJiAhLyg/PS4qWzAtOV0pLy50ZXN0KHZhbHVlc1tmaWVsZE5hbWVdKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbnRhaW5OdW1iZXIuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5TcGVjaWFsQ2hhciAmJiAhLyg/PS4qWyFAIyQlXiYqXSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpblNwZWNpYWxDaGFyLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXJyb3JzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2Zvcm1zOiB7ZGVmYXVsdDoge3RpdGxlLCBkZXNjcmlwdGlvbiwgZmllbGRzfX0sIHJlc291cmNlczoge3N1Y2Nlc3NNZXNzYWdlVGl0bGUsIHN1Y2Nlc3NNZXNzYWdlLCBsb2dpbkJ0bkxhYmVsfX0gPSBwcm9wcztcclxuXHJcbiAgICBjb25zdCBmb3JtRGlzcGxheSA9IHtcclxuICAgICAgICB0aXRsZSxcclxuICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICBzdWNjZXNzTWVzc2FnZVRpdGxlLFxyXG4gICAgICAgIHN1Y2Nlc3NNZXNzYWdlLFxyXG4gICAgICAgIGxvZ2luQnRuTGFiZWwgIFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZhbGlkYXRlID0gdmFsaWRhdG9yKGZpZWxkcyk7XHJcblxyXG4gICAgdmFyIFJlZHV4UmVnaXN0ZXJGb3JtID0gcmVkdXhGb3JtKHsgZm9ybTogJ3JlZ2lzdGVyRm9ybScsIHZhbGlkYXRlIH0pKFJlZ2lzdGVyRm9ybSk7XHJcblxyXG4gICAgUmVkdXhSZWdpc3RlckZvcm0gPSBjb25uZWN0KFxyXG4gICAgICAgIHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZvcm1EaXNwbGF5LFxyXG4gICAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xyXG4gICAgICAgIH0pXHJcbiAgICApKFJlZHV4UmVnaXN0ZXJGb3JtKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJSb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IG14LWF1dG8gbXQtMiBwdWxsLXhzLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFJlZHV4UmVnaXN0ZXJGb3JtLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L1Byb3ZpZGVyPlxyXG4gICAgICAgICk7XHJcbn0iLCLvu79jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IHtyZWR1eEZvcm0sIEZpZWxkfSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKTtcclxuY29uc3Qge1N1Ym1pc3Npb25FcnJvcn0gPSByZXF1aXJlKCdyZWR1eC1mb3JtJyk7XHJcbmNvbnN0IEZsaXBDYXJkID0gcmVxdWlyZSgncmVhY3QtZmxpcGNhcmQnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5cclxudmFyIHtCdXR0b24sIEFsZXJ0LCBJbnB1dCwgSW5wdXRHcm91cCwgSW5wdXRHcm91cEFkZG9uLCBGb3JtRmVlZGJhY2ssIEZvcm1Hcm91cCwgRm9ybVRleHQsIExhYmVsfSA9IHJlcXVpcmUoJ3JlYWN0c3RyYXAnKTtcclxuXHJcbmNvbnN0IFJlbmRlcklucHV0ID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7aW5wdXQsIGlkLCB0eXBlLCBwbGFjZWhvbGRlciwgdmFsaWRhdGlvblN0YXRlfSA9IHByb3BzO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgUmVhY3QuX19zcHJlYWQoe30sIGlucHV0LCB7IGlkOiBpZCwgc3RhdGU6IHZhbGlkYXRpb25TdGF0ZSwgdHlwZTogdHlwZSwgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyIH0pKVxyXG4gICAgKVxyXG59XHJcblxyXG5jb25zdCBSZW5kZXJJbnB1dEdyb3VwID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7aW5wdXQsIGRpc3BsYXk6IHtpZCwgdHlwZSwgbGFiZWwsIGRpc3BsYXlOYW1lLCBwbGFjZWhvbGRlciwgcHJvbXB0fSwgbWV0YToge3RvdWNoZWQsIGVycm9yLCB3YXJuaW5nfX0gPSBwcm9wcztcclxuXHJcbiAgICB2YXIgdmFsaWRhdGlvblN0YXRlID0gdG91Y2hlZCA/IChlcnJvciA/ICdkYW5nZXInIDogKHdhcm5pbmcgPyAnd2FybmluZycgOiAnc3VjY2VzcycpKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGNvbG9yOiB2YWxpZGF0aW9uU3RhdGUsIGNsYXNzTmFtZTogXCJtYi0xXCIgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dEdyb3VwLCBudWxsLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dEdyb3VwQWRkb24sIHsgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBsYWJlbCB9IH0pLFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgUmVhY3QuX19zcHJlYWQoe30sIGlucHV0LCB7IGlkOiBpZCwgc3RhdGU6IHZhbGlkYXRpb25TdGF0ZSwgdHlwZTogdHlwZSwgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyID8gcGxhY2Vob2xkZXIgOiBkaXNwbGF5TmFtZSB9KSlcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgcHJvbXB0ICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybVRleHQsIHsgY29sb3I6IFwibXV0ZWRcIiB9LCBwcm9tcHQpLFxyXG4gICAgICAgICAgICB0b3VjaGVkICYmICgoZXJyb3IgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtRmVlZGJhY2ssIG51bGwsIGVycm9yKSkgfHwgKHdhcm5pbmcgJiYgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtRmVlZGJhY2ssIG51bGwsIHdhcm5pbmcpKSlcclxuICAgICAgICApXHJcbiAgICApO1xyXG59XHJcblxyXG5jb25zdCBSZW5kZXJDaGVja0JveCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBkaXNwbGF5OiB7aWQsIHBsYWNlaG9sZGVyfX0gPSBwcm9wcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgY2hlY2s6IHRydWUgfSxcclxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgeyBjaGVjazogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgUmVhY3QuX19zcHJlYWQoe30sIGlucHV0LCB7IGlkOiBpZCwgdHlwZTogXCJjaGVja2JveFwiIH0pKSxcclxuICAgICAgICAgICAgICAgICcgJyArIHBsYWNlaG9sZGVyXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICApO1xyXG59XHJcblxyXG5jb25zdCByZW5kZXJGaWVsZCA9IHByb3BzID0+IHtcclxuICAgIGNvbnN0IHtkaXNwbGF5OiB7cmVuZGVyVHlwZX19ID0gcHJvcHM7XHJcbiAgICBpZiAocmVuZGVyVHlwZSA9PT0gXCJpbnB1dGdyb3VwXCIpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVySW5wdXRHcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdmb3JtZ3JvdXAnKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlbmRlckZvcm1Hcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVyQ2hlY2tCb3gocHJvcHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzdWJtaXQgPSBDb3JlaW4uY29tcG9uZW50cy5mb3JtLnN1Ym1pdCh7XHJcbiAgICB1cmw6ICdyZWdpc3RlcicsXHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHN1Y2Nlc3NBY3Rpb246IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGdsb2JhbC5yZWdpc3RlclN1Y2Nlc3NSZXR1cm5VcmwgPSByZXNwb25zZS5yZXN1bHQ7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3QgcmVnaXN0ZXJGb3JtID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7IGVycm9yLCBoYW5kbGVTdWJtaXQsIHByaXN0aW5lLCByZXNldCwgc3VibWl0dGluZywgc3VibWl0U3VjY2VlZGVkLCBmaWVsZHMsIGRpc3BsYXksIHJlc291cmNlcyB9ID0gcHJvcHM7XHJcblxyXG4gICAgY29uc3QgZm9ybUZpZWxkcyA9IFtdO1xyXG5cclxuICAgICQubWFwKGZpZWxkcywgKHByb3BzLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtpbnB1dDoge25hbWUsIHZhbHVlfSwgZGlzcGxheX0gPSBwcm9wcztcclxuICAgICAgICBmb3JtRmllbGRzLnB1c2goPEZpZWxkIGtleT17aW5kZXh9IGNvbXBvbmVudD17cmVuZGVyRmllbGR9IG5hbWU9e25hbWV9IHZhbHVlPXt2YWx1ZX0gZGlzcGxheT17ZGlzcGxheX0vPik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgaWQ9XCJSZWdpc3RlckZvcm1cIj5cclxuICAgICAgICAgICAgPEZsaXBDYXJkIGRpc2FibGVkPXt0cnVlfSBmbGlwcGVkPXtzdWJtaXRTdWNjZWVkZWR9PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdChzdWJtaXQpfSBjbGFzc05hbWU9XCJjYXJkLWJsb2NrXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMT57ZGlzcGxheS50aXRsZX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LW11dGVkXCI+e2Rpc3BsYXkuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IXN1Ym1pdHRpbmcgJiYgKGVycm9yICYmIDxBbGVydCBjb2xvcj1cImRhbmdlclwiPntlcnJvcn08L0FsZXJ0Pil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtRmllbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9PntkaXNwbGF5LnN1Ym1pdExhYmVsID8gZGlzcGxheS5zdWJtaXRMYWJlbCA6IFwiU3VibWl0XCJ9PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWJsb2NrIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LWNvbHVtbiB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+e2Rpc3BsYXkuc3VjY2Vzc01lc3NhZ2VUaXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntkaXNwbGF5LnN1Y2Nlc3NNZXNzYWdlfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17Z2xvYmFsLnJlZ2lzdGVyU3VjY2Vzc1JldHVyblVybH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zdWNjZXNzIG14LWNlbnRlclwiPntkaXNwbGF5LmxvZ2luQnRuTGFiZWx9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L0ZsaXBDYXJkPiBcclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyRm9ybSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTYgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcblxudmFyIF9jbGFzc25hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgX2NsYXNzbmFtZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NuYW1lcyk7XG5cbnZhciBfaGVscGVyc0NvbnRhaW5zID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb250YWlucycpO1xuXG52YXIgX2hlbHBlcnNDb250YWluczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQ29udGFpbnMpO1xuXG52YXIgX2hlbHBlcnNJbmplY3RTdHlsZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaW5qZWN0U3R5bGUnKTtcblxudmFyIF9oZWxwZXJzSW5qZWN0U3R5bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0luamVjdFN0eWxlKTtcblxuLy8gQXV0byBpbmplY3QgdGhlIHN0eWxlcyAod2lsbCBvbmx5IGJlIGRvbmUgb25jZSlcbigwLCBfaGVscGVyc0luamVjdFN0eWxlMlsnZGVmYXVsdCddKSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JlYWN0RmxpcENhcmQnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIHR5cGU6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZsaXBwZWQ6IF9yZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBkaXNhYmxlZDogX3JlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIG9uRmxpcDogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG9uS2V5RG93bjogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGNoaWxkcmVuOiBmdW5jdGlvbiBjaGlsZHJlbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAgICAgIHZhciBwcm9wID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoX3JlYWN0MlsnZGVmYXVsdCddLkNoaWxkcmVuLmNvdW50KHByb3ApICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2AnICsgY29tcG9uZW50TmFtZSArICdgICcgKyAnc2hvdWxkIGNvbnRhaW4gZXhhY3RseSB0d28gY2hpbGRyZW4uICcgKyAnVGhlIGZpcnN0IGNoaWxkIHJlcHJlc2VudHMgdGhlIGZyb250IG9mIHRoZSBjYXJkLiAnICsgJ1RoZSBzZWNvbmQgY2hpbGQgcmVwcmVzZW50cyB0aGUgYmFjayBvZiB0aGUgY2FyZC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdob3Jpem9udGFsJyxcbiAgICAgIGZsaXBwZWQ6IGZhbHNlLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGFzRm9jdXM6IGZhbHNlLFxuICAgICAgaXNGbGlwcGVkOiB0aGlzLnByb3BzLmZsaXBwZWRcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9oaWRlRmxpcHBlZFNpZGUoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIC8vIE1ha2Ugc3VyZSBib3RoIHNpZGVzIGFyZSBkaXNwbGF5ZWQgZm9yIGFuaW1hdGlvblxuICAgIHRoaXMuX3Nob3dCb3RoU2lkZXMoKTtcblxuICAgIC8vIFdhaXQgZm9yIGRpc3BsYXkgYWJvdmUgdG8gdGFrZSBlZmZlY3RcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNGbGlwcGVkOiBuZXdQcm9wcy5mbGlwcGVkXG4gICAgICB9KTtcbiAgICB9LCAwKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgLy8gSWYgY2FyZCBpcyBmbGlwcGluZyB0byBiYWNrIHZpYSBwcm9wcywgdHJhY2sgZWxlbWVudCBmb3IgZm9jdXNcbiAgICBpZiAoIXRoaXMucHJvcHMuZmxpcHBlZCAmJiBuZXh0UHJvcHMuZmxpcHBlZCkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgdGhhdCBmb2N1cyB3aWxsIHJldHVybiB0byB3aGVuIGZsaXBwZWQgYmFjayB0byBmcm9udFxuICAgICAgdGhpcy5mb2N1c0VsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgLy8gSW5kaWNhdGVzIHRoYXQgdGhlIGJhY2sgb2YgY2FyZCBuZWVkcyBmb2N1c1xuICAgICAgdGhpcy5mb2N1c0JhY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIGlzRmxpcHBlZCBoYXMgY2hhbmdlZCBuZWVkIHRvIG5vdGlmeVxuICAgIGlmICh0aGlzLnN0YXRlLmlzRmxpcHBlZCAhPT0gbmV4dFN0YXRlLmlzRmxpcHBlZCkge1xuICAgICAgdGhpcy5ub3RpZnlGbGlwID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgLy8gSWYgY2FyZCBoYXMgZmxpcHBlZCB0byBmcm9udCwgYW5kIGZvY3VzIGlzIHN0aWxsIHdpdGhpbiB0aGUgY2FyZFxuICAgIC8vIHJldHVybiBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJlZCBmbGlwcGluZyB0byB0aGUgYmFjay5cbiAgICBpZiAoIXRoaXMucHJvcHMuZmxpcHBlZCAmJiB0aGlzLmZvY3VzRWxlbWVudCAmJiAoMCwgX2hlbHBlcnNDb250YWluczJbJ2RlZmF1bHQnXSkoKDAsIF9yZWFjdERvbS5maW5kRE9NTm9kZSkodGhpcyksIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0aGlzLmZvY3VzRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5mb2N1c0VsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBEaXJlY3QgZm9jdXMgdG8gdGhlIGJhY2sgaWYgbmVlZGVkXG4gICAgLyogZXNsaW50IGJyYWNlLXN0eWxlOjAgKi9cbiAgICBlbHNlIGlmICh0aGlzLmZvY3VzQmFjaykge1xuICAgICAgICB0aGlzLnJlZnMuYmFjay5mb2N1cygpO1xuICAgICAgICB0aGlzLmZvY3VzQmFjayA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgLy8gTm90aWZ5IGNhcmQgYmVpbmcgZmxpcHBlZFxuICAgIGlmICh0aGlzLm5vdGlmeUZsaXAgJiYgdHlwZW9mIHRoaXMucHJvcHMub25GbGlwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnByb3BzLm9uRmxpcCh0aGlzLnN0YXRlLmlzRmxpcHBlZCk7XG4gICAgICB0aGlzLm5vdGlmeUZsaXAgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHdoaWNoZXZlciBzaWRlIG9mIHRoZSBjYXJkIGlzIGRvd25cbiAgICBzZXRUaW1lb3V0KHRoaXMuX2hpZGVGbGlwcGVkU2lkZSwgNjAwKTtcbiAgfSxcblxuICBoYW5kbGVGb2N1czogZnVuY3Rpb24gaGFuZGxlRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZGlzYWJsZWQpIHJldHVybjtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNGbGlwcGVkOiB0cnVlXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlQmx1cjogZnVuY3Rpb24gaGFuZGxlQmx1cigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0ZsaXBwZWQ6IGZhbHNlXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlS2V5RG93bjogZnVuY3Rpb24gaGFuZGxlS2V5RG93bihlKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uS2V5RG93biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5wcm9wcy5vbktleURvd24oZSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICgwLCBfY2xhc3NuYW1lczJbJ2RlZmF1bHQnXSkoe1xuICAgICAgICAgICdSZWFjdEZsaXBDYXJkJzogdHJ1ZSxcbiAgICAgICAgICAnUmVhY3RGbGlwQ2FyZC0tdmVydGljYWwnOiB0aGlzLnByb3BzLnR5cGUgPT09ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgJ1JlYWN0RmxpcENhcmQtLWhvcml6b250YWwnOiB0aGlzLnByb3BzLnR5cGUgIT09ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgJ1JlYWN0RmxpcENhcmQtLWZsaXBwZWQnOiB0aGlzLnN0YXRlLmlzRmxpcHBlZCxcbiAgICAgICAgICAnUmVhY3RGbGlwQ2FyZC0tZW5hYmxlZCc6ICF0aGlzLnByb3BzLmRpc2FibGVkXG4gICAgICAgIH0pLFxuICAgICAgICB0YWJJbmRleDogMCxcbiAgICAgICAgb25Gb2N1czogdGhpcy5oYW5kbGVGb2N1cyxcbiAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRsZUJsdXIsXG4gICAgICAgIG9uS2V5RG93bjogdGhpcy5oYW5kbGVLZXlEb3duXG4gICAgICB9LFxuICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fRmxpcHBlcidcbiAgICAgICAgfSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fRnJvbnQnLFxuICAgICAgICAgICAgcmVmOiAnZnJvbnQnLFxuICAgICAgICAgICAgdGFiSW5kZXg6IC0xLFxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogdGhpcy5zdGF0ZS5pc0ZsaXBwZWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5bMF1cbiAgICAgICAgKSxcbiAgICAgICAgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnUmVhY3RGbGlwQ2FyZF9fQmFjaycsXG4gICAgICAgICAgICByZWY6ICdiYWNrJyxcbiAgICAgICAgICAgIHRhYkluZGV4OiAtMSxcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICF0aGlzLnN0YXRlLmlzRmxpcHBlZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblsxXVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBfc2hvd0JvdGhTaWRlczogZnVuY3Rpb24gX3Nob3dCb3RoU2lkZXMoKSB7XG4gICAgdGhpcy5yZWZzLmZyb250LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB0aGlzLnJlZnMuYmFjay5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gIH0sXG5cbiAgX2hpZGVGbGlwcGVkU2lkZTogZnVuY3Rpb24gX2hpZGVGbGlwcGVkU2lkZSgpIHtcbiAgICAvLyBUaGlzIHByZXZlbnRzIHRoZSBmbGlwcGVkIHNpZGUgZnJvbSBiZWluZyB0YWJiYWJsZVxuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc0ZsaXBwZWQpIHtcbiAgICAgICAgdGhpcy5yZWZzLmZyb250LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlZnMuYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvLyBDaGVja3MgdG8gc2VlIGlmIGEgcGFyZW50IGVsZW1lbnQgY29udGFpbnMgYSBjaGlsZCBlbGVtZW50XG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCwgbm8tY29uZC1hc3NpZ246MCAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICBkbyB7XG4gICAgaWYgKHBhcmVudCA9PT0gY2hpbGQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSB3aGlsZSAoY2hpbGQgJiYgKGNoaWxkID0gY2hpbGQucGFyZW50Tm9kZSkpO1xuICByZXR1cm4gZmFsc2U7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgQ1NTID0gJ1xcbi5SZWFjdEZsaXBDYXJkIHtcXG4gIC13ZWJraXQtcGVyc3BlY3RpdmU6IDEwMDA7XFxuICAtbW96LXBlcnNwZWN0aXZlOiAxMDAwO1xcbiAgLW1zLXBlcnNwZWN0aXZlOiAxMDAwO1xcbiAgcGVyc3BlY3RpdmU6IDEwMDA7XFxuXFxuICAtbXMtdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDAwcHgpO1xcbiAgLW1vei10cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMDBweCk7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG5cXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG59XFxuXFxuLyogU1RBUlQ6IEFjY29tbW9kYXRpbmcgZm9yIElFICovXFxuLlJlYWN0RmxpcENhcmQtLWVuYWJsZWQuUmVhY3RGbGlwQ2FyZDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fQmFjayxcXG4uUmVhY3RGbGlwQ2FyZC0tZmxpcHBlZCAuUmVhY3RGbGlwQ2FyZF9fQmFjayB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1tb3otdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1vLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLWVuYWJsZWQuUmVhY3RGbGlwQ2FyZDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fRnJvbnQsXFxuLlJlYWN0RmxpcENhcmQtLWZsaXBwZWQgLlJlYWN0RmxpcENhcmRfX0Zyb250IHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG59XFxuLyogRU5EOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcblxcbi5SZWFjdEZsaXBDYXJkX19GbGlwcGVyIHtcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogMC42cztcXG4gIC13ZWJraXQtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIC1tcy10cmFuc2l0aW9uOiAwLjZzO1xcblxcbiAgLW1vei10cmFuc2l0aW9uOiAwLjZzO1xcbiAgLW1vei10cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDEwMDBweCk7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG5cXG4gIHRyYW5zaXRpb246IDAuNnM7XFxuICB0cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcblxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uUmVhY3RGbGlwQ2FyZF9fRnJvbnQsIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgLW1vei1iYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XFxuICAtbXMtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcblxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjZzO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuXFxuICAtbW96LXRyYW5zaXRpb246IDAuNnM7XFxuICAtbW96LXRyYW5zZm9ybS1zdHlsZTogcHJlc2VydmUtM2Q7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG5cXG4gIC1vLXRyYW5zaXRpb246IDAuNnM7XFxuICAtby10cmFuc2Zvcm0tc3R5bGU6IHByZXNlcnZlLTNkO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcblxcbiAgLW1zLXRyYW5zaXRpb246IDAuNnM7XFxuICAtbXMtdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIC1tcy10cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuXFxuICB0cmFuc2l0aW9uOiAwLjZzO1xcbiAgdHJhbnNmb3JtLXN0eWxlOiBwcmVzZXJ2ZS0zZDtcXG4gIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG5cXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxufVxcblxcbi5SZWFjdEZsaXBDYXJkX19Gcm9udCB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1tb3otdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIC1vLXRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gIHotaW5kZXg6IDI7XFxufVxcblxcbi5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZVkoLTE4MGRlZyk7XFxuICAtbXMtdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVZKC0xODBkZWcpO1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoLTE4MGRlZyk7XFxufVxcblxcbi8qIHZlcnRpY2FsICovXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKTtcXG59XFxuXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsIC5SZWFjdEZsaXBDYXJkX19GbGlwcGVyIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIC1tb3otdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIC1tcy10cmFuc2Zvcm0tb3JpZ2luOiAxMDAlIDE1MHB4O1xcbiAgLW8tdHJhbnNmb3JtLW9yaWdpbjogMTAwJSAxNTBweDtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IDEwMCUgMTUwcHg7XFxufVxcblxcbi8qIFNUQVJUOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcbi5SZWFjdEZsaXBDYXJkLS1lbmFibGVkLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsOmhvdmVyIC5SZWFjdEZsaXBDYXJkX19CYWNrLFxcbi5SZWFjdEZsaXBDYXJkLS12ZXJ0aWNhbC5SZWFjdEZsaXBDYXJkLS1mbGlwcGVkIC5SZWFjdEZsaXBDYXJkX19CYWNrIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZVgoMGRlZyk7XFxuICAtbXMtdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbiAgdHJhbnNmb3JtOiByb3RhdGVYKDBkZWcpO1xcbn1cXG5cXG4uUmVhY3RGbGlwQ2FyZC0tZW5hYmxlZC5SZWFjdEZsaXBDYXJkLS12ZXJ0aWNhbDpob3ZlciAuUmVhY3RGbGlwQ2FyZF9fRnJvbnQsXFxuLlJlYWN0RmxpcENhcmQtLXZlcnRpY2FsLlJlYWN0RmxpcENhcmQtLWZsaXBwZWQgLlJlYWN0RmxpcENhcmRfX0Zyb250IHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW1zLXRyYW5zZm9ybTogcm90YXRlWCgxODBkZWcpO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGVYKDE4MGRlZyk7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZVgoMTgwZGVnKTtcXG59XFxuLyogRU5EOiBBY2NvbW1vZGF0aW5nIGZvciBJRSAqL1xcbic7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlYWN0LWZsaXBjYXJkLXN0eWxlJyk7XG4gIGlmICghc3R5bGUpIHtcbiAgICBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKCdpZCcsICdyZWFjdC1mbGlwY2FyZC1zdHlsZScpO1xuICAgIHZhciBoZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpO1xuICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICB9XG4gIHN0eWxlLmlubmVySFRNTCA9IENTUztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvRmxpcENhcmQnKTsiXX0=
