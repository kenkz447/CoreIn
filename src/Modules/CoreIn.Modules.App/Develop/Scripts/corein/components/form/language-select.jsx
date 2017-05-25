const $ = require('jquery');
const classnames = require('classnames');

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
        this.getUrl = this.getUrl.bind(this);
        this.isCurrentLang = this.isCurrentLang.bind(this);
    }

    isCurrentLang(lang) {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        var langParam = searchParams.get('lang');

        return (langParam === lang) || (!langParam && this.props.defaultLanguage === lang);
    }

    getUrl(lang) {
        return window.location.pathname + addUrlParam(window.location.search, 'lang', lang);
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
                {(languages.length >= 5) ?
                    <div>
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
                    </div> :
                    <div className="clearfix">
                        <div className="pull-left">
                            Nhập nội dung cho: 
                        </div>
                        <div className="pull-left">
                            {
                                $.map(languages, (lang, index) => {
                                    const isCurrentLang = this.isCurrentLang(index);
                                    return (
                                        <div key={index} className="pull-right ml-h">
                                            <a className={classnames({ 'current-lang': isCurrentLang })} href={!isCurrentLang ? this.getUrl(index) : "#"}>{lang}</a>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
};