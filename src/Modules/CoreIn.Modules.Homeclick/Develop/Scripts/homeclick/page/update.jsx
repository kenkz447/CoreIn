const $ = require('jquery');
const Page = Corein.pageTemplates.update;

const { createNewUrl, update: { formUrl, formSubmitData } } = require('./shared');

module.exports = (props) => {
    const pageProps = $.extend(true, { createNewUrl, formUrl, formSubmitData }, props);

    return (
        <Page {...pageProps} />
    );
};