const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { Input } = require('reactstrap');

const { swithLanguage } = require('../../reducers/localization').actions;

class LanguageSelect extends React.Component {
    render(){
        const { languages, currentLanguage, swithLanguage } = this.props;
        return (
            <form method="post" action="localization/switch" ref="form">
                <Input name="culture" value={currentLanguage} className="text-uppercase border-0 p-0" type="select" onChange={(e) => { this.refs.form.submit(); }}>
                    { 
                        languages.map((language) => {
                            return <option key={language.name} value={language.name}>{language.title}</option>;
                        })
                    }
                </Input>
            </form>
            );
    }
}

const stateToProps = (state) => ({
    currentLanguage: state.localization.currentLanguage,
    languages: state.localization.languages
});

const dispathToProps = (dispatch) => (
    bindActionCreators({  }, dispatch)
);

module.exports = connect(stateToProps, dispathToProps)(LanguageSelect)