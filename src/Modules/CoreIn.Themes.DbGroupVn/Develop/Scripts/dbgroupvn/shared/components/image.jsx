module.exports = (props) => {
    const { url, title, description, className } = props;

    return (
        <img className={`w-100 ${className}`} src={`/${url}`} title={title} alt={description}/>
    );
}