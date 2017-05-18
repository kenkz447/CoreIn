const Index = Corein.pageTemplates.index;
const { create, index: { dataUrl, deleteUrl, tableColumns}} = require('./shared');

module.exports = (props) => {
    const { title } = props;

    return (
        <Index title={title} createNewUrl={create.url} dataUrl={dataUrl} deleteUrl={deleteUrl} tableColumns={tableColumns} />
    );
};