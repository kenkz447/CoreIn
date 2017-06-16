const { Button } = require('reactstrap');

module.exports = (props) => {
    return (
        <div>
            <Button color="link" className="btn-search text-uppercase pl-0 pr-0 border-0">
                <i className="fa fa-search mr-2" aria-hidden="true"/> search
            </Button>
        </div>
        )
}