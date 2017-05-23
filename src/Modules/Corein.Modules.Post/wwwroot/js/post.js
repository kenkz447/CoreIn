(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const index = require('./post/index');
const create = require('./post/create');
const update = require('./post/update');

module.exports = {
    index,
    create,
    update
}

},{"./post/create":2,"./post/index":3,"./post/update":5}],2:[function(require,module,exports){
const $ = require('jquery');

const { index, create: {formUrl, formSubmitData}} = require('./shared');

const Page = Corein.pageTemplates.create;

module.exports = (props) => {
    const pageProps = $.extend(true, { formUrl, formSubmitData, indexUrl: index.url }, props);

    return (
        React.createElement(Page, React.__spread({},  pageProps))
    );
};

},{"./shared":4,"jquery":"XpFelZ"}],3:[function(require,module,exports){
const Index = Corein.pageTemplates.index;
const { create, index: { dataUrl, deleteUrl, tableColumns } } = require('./shared');

const Create = require('./create');

module.exports = (props) => {
    const { title } = props;

    return (
        React.createElement(Index, {title: title, createNewUrl: create.url, dataUrl: dataUrl, deleteUrl: deleteUrl, tableColumns: tableColumns})            
    );
};

},{"./create":2,"./shared":4}],4:[function(require,module,exports){
const $ = require('jquery');

const mvcController = 'post';

module.exports = {
    index: {
        url: `/${mvcController}`,
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
        url: `/${mvcController}/update`,
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

},{"jquery":"XpFelZ"}],5:[function(require,module,exports){
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

},{"./shared":4,"jquery":"XpFelZ"}],6:[function(require,module,exports){
(function (global){
﻿global.Corein.post = require('./corein/post');

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./corein/post":1}]},{},[6])

//# sourceMappingURL=post.js.map
