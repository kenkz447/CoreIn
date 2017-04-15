class FileThumbList extends React.Component {
    constructor(props) {
        super(props);
        var state = {
            isLoaded: false
        };
        $.extend(state, props);
        this.state = state;
    };

    render() {
        var items = [];
        this.props.items.map(item => {
            items.push(<FileThumb key={item.id} 
                                  fileId={item.id} 
                                  fileName={item.fileName} 
                                  fieldId={"thumb_" + item.id} 
                                  src={item.src} itemChecked={this.state.itemChecked}/>);
            }); 

        return (
                <div className="container-fluid">
                    <div className="row">{items}
                    </div>
                </div>
            );
    };
};

