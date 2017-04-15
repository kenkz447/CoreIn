class JFiler extends React.Component {
    constructor(props) {
        super(props);
        var state = {
            isLoaded: false
        };
        $.extend(state, props.data);
        this.state = state;
    };

    componentDidMount() {
        if (!this.state.isLoaded) {
            var target = '#' + this.state.id;
            var opts = {
                changeInput: '<div class="jFiler-input-dragDrop m-0 w-100"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span>or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
		        showThumbs: false,
		        theme: "dragdropbox", 
		        dragDrop: {

		        },
                uploadFile: {
                    url: '/Admin/FileManager/Upload',
                    data: {},
                    type: 'POST',
                    enctype: 'multipart/form-data',
                }
            };
            $(target).filer(opts);
        }
        this.setState({ isLoaded: true });
    };

    render() {
        return (
            <div className="jFiler jFiler-theme-dragdropbox">
                <input type="file" multiple={this.props.multiple} name={this.state.name} id={this.state.id} className="collapse"/>
            </div>
            );
    };
};

