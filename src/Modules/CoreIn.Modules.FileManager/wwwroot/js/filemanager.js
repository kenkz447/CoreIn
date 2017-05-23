(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControl, fileManager: { FileManager, fmReducer } } = Corein.components;

const reducers = {
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControl.reducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer); 

module.exports = {
    index: (props) => {
		return (
			React.createElement(Provider, {store: store}, 
				React.createElement(FileManager, null)
			)
		);
	}	
}

},{"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],2:[function(require,module,exports){
(function (global){
﻿global.Admin = {
    fileManager: require('./admin/file-manager')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./admin/file-manager":1}]},{},[2])

//# sourceMappingURL=filemanager.js.map
