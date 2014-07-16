/**
 * Simple wrapper around ACE editor
 */
class SourceEditor extends qx.ui.core.Widget {

    private aceEditor;
    private popup:qx.ui.popup.Popup;

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
             this.setupInputHandling();
        }, this);
        this.setContextMenu(this.createContextMenu());
        this.popup = new qx.ui.popup.Popup(new qx.ui.layout.Flow());
        this.popup.add(new qx.ui.basic.Label("Code completion"));
    }

    autoComplete() {
        
        // alert("auto complete");
        var cursor = this.aceEditor.getCursorPosition();
        var coords = this.aceEditor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
        this.popup.moveTo(coords.pageX, coords.pageY);
        this.popup.show();
    }

    setupInputHandling() {
        
        var originalTextInput = this.aceEditor.onTextInput;
        this.aceEditor.onTextInput = (text) => {
                originalTextInput.call(this.aceEditor, text);
                if (text === ".") this.autoComplete();
        };
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