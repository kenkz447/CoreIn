const Image = (props) => {
    const { url, title, description, className } = props;

    const src = String(url).startsWith('uploads') ? '/' + url : url

    return (
        <img className={`w-100 ${className}`} src={src} title={title && title} alt={description && description}/>
    );
}

export default Image