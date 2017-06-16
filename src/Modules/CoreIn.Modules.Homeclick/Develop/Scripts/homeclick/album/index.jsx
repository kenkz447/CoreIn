const $ = require('jquery');
const Page = Corein.pageTemplates.index;
const { index: { dataUrl, deleteUrl, tableColumns } } = require('./shared');

module.exports = (props) => {
    const pageProps = $.extend(true, {
        dataUrl,
        deleteUrl,
        tableColumns
    }, props);

    return (
        <Page {...pageProps} />
    );
};