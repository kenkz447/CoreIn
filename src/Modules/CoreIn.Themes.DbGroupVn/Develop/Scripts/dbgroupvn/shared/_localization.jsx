import { default as enUS } from './_localization/en-us'

const strings = {
    'vi-VN': {
    },
    'en-US': enUS
};

export default class {
    constructor() {
        this.strings = strings;
    }

    setLanguage(language) {
        this.language = language;
    }

    getString(string) {
        return this.strings[ this.language ][ string ] || string;
    }
}