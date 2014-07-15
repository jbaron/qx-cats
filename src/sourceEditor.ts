/**
 * Simple wrapper around ACE editor
 */
class SourceEditor extends qx.ui.core.Widget {

    private aceEditor;

    constructor(content?:string) {
        super();
        this.addListenerOnce("appear", () => {
            var container = this.getContentElement().getDomElement();
            // create the editor
            this.aceEditor = ace.edit(container);
            this.aceEditor.getSession().setMode("ace/mode/typescript");
            // this.aceEditor.getSession().setValue(this.getContent());
            this.aceEditor.getSession();
            if (content) this.setContent(content);
            this.addListener("resize", () => {
                // use a timeout to let the layout queue apply its changes to the dom
                window.setTimeout(() => {
                    this.aceEditor.resize();
                }, 0);
            });

        }, this);
        this.setContextMenu(this.createContextMenu());
    }


    setContent(value:string) {
        this.aceEditor.getSession().setValue(value);
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