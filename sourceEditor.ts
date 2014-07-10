
class SourceEditor extends qx.ui.core.Widget {


constructor() {
    super();
    this.addListenerOnce("appear", () => {
        var container = this.getContentElement().getDomElement();
        // create the editor
        var aceEditor = ace.edit(container);
        aceEditor.getSession().setMode("ace/mode/typescript");
        aceEditor.getSession().setValue(fs.readFileSync("./application.ts","UTF8"));
        this.addListener("resize", function() {
          // use a timeout to let the layout queue apply its changes to the dom
          window.setTimeout(function() {
            aceEditor.resize();
          }, 0);
        });

    }, this);

}
}