class FileManagerIndex extends React.Component {
    constructor(props) {
        super(props);
        var state = {
            items: [],
            alerts: [],
            jFiler: {
                multiple: true,
                id: 'files',
                name: 'files'
            }
        };
        $.extend(state, props);
        this.state = state;

        $.ajax({
            url: "/Admin/FileManager/GetFiles",
            data: {},
            method: "POST",
            success: data => {
                var items = this.state.items;
                items = items.concat(data);
                this.setState({ items: items })
            }
        });
        this.loaded = false;

        this.checkedItems = [];
        this.deleteBtnClicked = this.deleteBtnClicked.bind(this);
        this.itemChecked = this.itemChecked.bind(this);
    };


    deleteBtnClicked(event) {
        //var data = JSON.stringify({ fileNames: this.checkedItems });
        $.ajax({
            url: '/Admin/FileManager/DeleteFiles',
            data: { files: this.checkedItems },
            method: 'POST',
            success: data => {
                for (var i = 0; i < this.checkedItems.length; i++) {
    
                }
                this.state.items.find(item => {
                    return item.fileName = "";
                    });
                this.checkedItems = [];
            }
        });
    }

    itemChecked(event) {
        var $target = $(event.target);
        var fileName = $target.data('file-name');
        if ($target.prop('checked'))
            this.checkedItems.push(fileName);
        else
            this.checkedItems.splice(this.checkedItems.indexOf(fileName), 1);
    }

    render() {

        this.loaded = true;

        var alerts = [];
        this.state.alerts.map(alert, index => {
            alerts.push(<Alert key={index} status={notify.status} title={notify.title} message={notify.message }/>);
        });

        return (
            <div id="MainContainer" className="container-fluid">
                <div className="alerts">
                    {alerts}
                </div>
                <div id="collapseExample" className="collapse" >
                    <div className="card card-block">
                        <JFiler data={this.state.jFiler} />
                    </div>
                </div>

                <FileThumbList items={this.state.items} itemChecked={this.itemChecked}/>

                <FloatingButton>
                    <div className="nd2 nds" data-toggle="tooltip" data-placement="left" data-original-title="Delete">
                        <div className="floating-action" onClick={this.deleteBtnClicked}>
                            <i className="fa fa-trash"></i>
                        </div>
                    </div>
                    <div className="nd1 nds" data-toggle="tooltip" data-placement="left" data-original-title="Uploads">
                        <div className="floating-action" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            <i className="icon-cloud-upload"></i>
                        </div>
                    </div>
                </FloatingButton>
            </div>
        );
    }
};