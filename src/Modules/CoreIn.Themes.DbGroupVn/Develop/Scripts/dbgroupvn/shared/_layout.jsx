const Header = require('./components/_header');

module.exports = (props) => {
    const { children } = props;
    return (
        <div className="layout">
            <Header />
            <div className="main">
                {children}
            </div>
        </div>
        );
}