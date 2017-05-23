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
        <Page {...pageProps} />
    );
};