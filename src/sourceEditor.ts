/**
 * Simple wrapper around ACE editor
 */
class SourceEditor extends qx.ui.core.Widget {

    constructor() {
        super();
        this.addListenerOnce("appear", () => {
            var container = this.getContentElement().getDomElement();
            // create the editor
            var aceEditor = ace.edit(container);
            aceEditor.getSession().setMode("ace/mode/typescript");
            aceEditor.getSession().setValue(this.getContent());
            this.addListener("resize", function() {
                // use a timeout to let the layout queue apply its changes to the dom
                window.setTimeout(function() {
                    aceEditor.resize();
                }, 0);
            });

        }, this);

    }

    private getContent() {
        try {
            var fs = require("fs");
            return fs.readFileSync("./src/application.ts", "UTF8");
        } catch (err) {
        return "var i = 0;\n"
    }

    }

}