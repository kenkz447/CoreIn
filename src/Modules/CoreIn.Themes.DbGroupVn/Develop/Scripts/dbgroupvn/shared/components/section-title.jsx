module.exports = (props) => {
    return (
        <div className="section-title w-100 text-center mb-3 mb-lg-4 mb-lg-5">
            <h2 className="title">
                {props.children}
            </h2>
        </div>
    );
}