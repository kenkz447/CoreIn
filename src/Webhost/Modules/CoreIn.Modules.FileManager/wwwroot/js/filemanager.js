(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControlReducer, fileManager: { FileManager, fmReducer } } = Corein;

const reducers = {
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer); 

const FileManagerIndex = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(FileManager, null)
        )
        );
}

global.FileManagerIndex = FileManagerIndex;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}]},{},[1])

//# sourceMappingURL=filemanager.js.map
