//???
class StyleSheet {
    constructor(styles) {
        // Create the <style> tag
        var style = document.createElement("style");

        // WebKit hack
        style.appendChild(document.createTextNode(""));


        // Add the <style> element to the page
        document.head.appendChild(style);


        this.style = style
        this.insertRule = this.insertRule.bind(this)
        this.insertRule(styles)
    }

    insertRule(styles, index = 0) {
        this.style.sheet.insertRule(styles, index)
    }

    removeStyle() {
        document.head.removeChild(this.style)
    }
}

export default StyleSheet