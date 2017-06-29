global.jQuery = require('jquery')
global.$ = global.jQuery
global.Tether = require('tether')
global.Bootstrap = require('bootstrap')
global.React = require('react')
global.ReactDOM = require('react-dom')

require('./lib/sticky-kit')

//Global vars
global.__DEV__ = true;
global.APP_DOMAIN = 'http://localhost:3000/'