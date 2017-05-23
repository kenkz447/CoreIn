const $ = require('jquery');
const { Button, Input } = require('reactstrap');

var addUrlParam = function (search, key, val) {
    var newParam = key + '=' + val,
        params = '?' + newParam;

    // If the "search" string exists, then build params from it
    if (search) {
        // Try to replace an existance instance
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);

        // If nothing was replaced, then add the new param to the end
        if (params === search) {
            params += '&' + newParam;
        }
    }

    return params;
};

module.exports = class LanguageSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLang: props.defaultLanguage
        };

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onSelectChange(e) {
        var target = e.target;
        this.setState({ selectedLang: target.value });
    }

    onButtonClick(e) {
        window.location.href = window.location.pathname + addUrlParam(window.location.search, 'lang', this.state.selectedLang);
    }

    render() {
        const { languages} = this.props;

        return (
            <div className="form-language">
                <div className="pull-right ml-q">
                    <Button className="btn btn-secondary"
                        onClick={this.onButtonClick}>OK</Button>
                </div>
                <div className="pull-right" >
                    <Input type="select" value={this.state.selectedLang} onChange={this.onSelectChange}>
                        {
                            $.map(languages, (lang, index) => {
                                return <option key={index} value={index}>{lang}</option>;
                            })
                        }
                    </Input>
                </div>
            </div>
        );
    }
};