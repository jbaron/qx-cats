/**
 * Simple wrapper around ACE editor
 */
class SourceEditor extends qx.ui.core.Widget {

    private aceEditor;

    constructor() {
        super();
        this.addListenerOnce("appear", () => {
            var container = this.getContentElement().getDomElement();
            // create the editor
            this.aceEditor = ace.edit(container);
            this.aceEditor.getSession().setMode("ace/mode/typescript");
            this.aceEditor.getSession().setValue(this.getContent());
            this.aceEditor.getSession();
            
            this.addListener("resize", () => {
                // use a timeout to let the layout queue apply its changes to the dom
                window.setTimeout(() => {
                    this.aceEditor.resize();
                }, 0);
            });

        }, this);
        this.setContextMenu(this.createContextMenu());
    }

    private getContent() {
        try {
            var fs = require("fs");
            return fs.readFileSync("./src/application.ts", "UTF8");
        } catch (err) {
        return "var i = 0;\n"
    }
    }
    
    private createContextMenu() {
        var menu = new qx.ui.menu.Menu();
        var item1 = new qx.ui.menu.Button("Goto Declaration");
        var item2 = new qx.ui.menu.Button("Find reference");
        menu.add(item1);
        menu.add(item2);
        return menu;
    }
  
    

    

}