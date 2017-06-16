const enUS = require('./_localization/en-us');

var strings = {
    'vi-VN': {
    },
    'en-US': enUS
};

class localization {
    constructor(){
        this.strings = strings;
    }

    setLanguage(language){
        this.language = language;
    }

    getString(string){
        return this.strings[this.language][string] || string;
    }
}

module.exports = new localization();