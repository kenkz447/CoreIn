const $ = require('jquery');

const { index, create: {formUrl, formSubmitData}} = require('./shared');

const Page = Corein.pageTemplates.create;

module.exports = (props) => {
    const pageProps = $.extend(true, { formUrl, formSubmitData, indexUrl: index.url }, props);

    return (
        <Page {...pageProps} />
    );
};