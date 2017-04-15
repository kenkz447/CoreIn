class FileThumb extends React.Component {
    constructor(props) {
        super(props);
        var state = {
            isLoaded: false
        };
        $.extend(state, props);
        this.state = state;
    };

    
    render() {
        var src = "";
        if ((/\.(jpg|png|jpeg|bmp|gif|ico)$/i).test(this.state.fileName)) {
            src = this.state.src
        }

        return (
            <div className="col-md-2 p-0">
                <div className="card card-fileThumb p-1 mb-1 mr-1">
                    <label className="fancy-checkbox-label" htmlFor={this.state.id}>
                        <input type="checkbox" id={this.state.fieldId} name={this.state.name} data-file-id={this.state.fileId} data-file-name={this.state.fileName} onChange={this.state.itemChecked}/>
                        <span className="fancy-checkbox fancy-checkbox-img"></span>
                        {(src.length ? <img src={src} /> : <span className="fancy-thumb-icon"><i className="fa fa-file"></i></span>)}
                    </label>
                </div>
            </div>
            );
    };
};

