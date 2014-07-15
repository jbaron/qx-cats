declare var require: any;
declare var ace: any;
declare var process;

/**
 * The main IDE class that contains the layout and various 
 * components that make up CATS
 */
class Ide {
    navigatorPane: TabPane;
    problemPane: TabPane;
    toolBar: ToolBar
    infoPane: TabPane;
    statusBar: qx.ui.toolbar.ToolBar;
    sessionPane: TabPane;
    console:Console123;

    doc: qx.ui.container.Composite;

    constructor(app: qx.application.Standalone) {
        this.doc = <qx.ui.container.Composite>app.getRoot();
    }

    layout() {
        // container layout
        var layout = new qx.ui.layout.VBox();

        // main container
        var mainContainer = new qx.ui.container.Composite(layout);
        this.doc.add(mainContainer, { edge: 0 });

        this.toolBar = new ToolBar();

        mainContainer.add(this.toolBar, { flex: 0 });

        // mainsplit, contains the editor splitpane and the info splitpane
        var mainsplit = new qx.ui.splitpane.Pane("horizontal").set({ decorator: null });
        this.navigatorPane = new TabPane(["Files", "Outline"]);
        var fileTree = new FileNavigator(process.cwd());
        this.navigatorPane.getChildren()[0].add(fileTree, { edge: 0 });
        this.navigatorPane.getChildren()[1].add(new OutlineNavigator(), { edge: 0 });



        mainsplit.add(this.navigatorPane, 1); // navigator


        var editorSplit = new qx.ui.splitpane.Pane("vertical").set({ decorator: null });

        var infoSplit = new qx.ui.splitpane.Pane("horizontal");
        this.sessionPane = new TabPane(["file1", "file2", "file3", "file4"], true);
        infoSplit.set({ decorator: null });
        infoSplit.add(this.sessionPane, 4); // editor
        this.sessionPane.getChildren().forEach((c) => {
            c.add(new SourceEditor(), { edge: 0 });
        });
        
        this.infoPane = new TabPane(["Todo", "Properties"]);
        infoSplit.add(this.infoPane, 1); // todo

        editorSplit.add(infoSplit, 4);

        // Setup Problems section
        this.problemPane = new TabPane(["Problems", "Search", "Console"]);
        this.console = new Console123();

        editorSplit.add(this.problemPane, 2); // Info

        this.problemPane.getChildren()[0].add(new ResultTable(), { edge: 0 });
        this.problemPane.getChildren()[1].add(new ResultTable(), { edge: 0 });
        this.problemPane.getChildren()[2].add(this.console, { edge: 0 });

        this.problemPane.select("Console");
        // this.problemPane.setSelection([this.problemPane.getChildren()[2]]);


        mainsplit.add(editorSplit, 4); // main area

        mainContainer.add(mainsplit, { flex: 1 });

        // Setup status bar
        this.statusBar = new qx.ui.toolbar.ToolBar();
        this.statusBar.add(new qx.ui.toolbar.Button("1:1"));
        mainContainer.add(this.statusBar, { flex: 0 });
    }

}

var IDE: Ide;

/**
 * This function is called from Qooxdoo to start everything
 */
function qooxdooMain(app: qx.application.Standalone) {
    IDE = new Ide(app);
    IDE.layout();
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
