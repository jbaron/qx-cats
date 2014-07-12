declare var require:any;


declare var ace:any;

function createPage(name,close:boolean) {
    var tab = new qx.ui.tabview.Page(name);
    tab.setShowCloseButton(close);
    tab.setLayout(new qx.ui.layout.Canvas());
    tab.setPadding(0,0,0,0);
    tab.setMargin(0,0,0,0);
    tab.setDecorator(null);
    return tab;        
}

class TabPane extends qx.ui.tabview.TabView {

    private tabs = [];
    
    constructor(tabNames:string[],close=false) {
        super();
        this.setPadding(0,0,0,0);
        this.setContentPadding(1,0,0,0);
        tabNames.forEach((name) => {
            var tab = createPage(name,close);
            this.add(tab);
            this.tabs.push(tab);
        });
    }
    
}

class MyPane extends qx.ui.core.Widget {
    
    constructor(color:string) {
        super();
        this.set({ backgroundColor: color });
    
        this.addListener("dblclick", (e) => {
                
        })
    }
}



/**
 * Setup the main layout
 */ 
function qooxdooMain(app: qx.application.Standalone) {
    qx.core.Environment.add("qx.nativeScrollBars", true);
     var doc = <qx.ui.container.Composite>app.getRoot();
   
    // container layout
      var layout = new qx.ui.layout.VBox();

      // main container
      var mainContainer = new qx.ui.container.Composite(layout);
      doc.add(mainContainer, { edge : 0 });

     
      
      mainContainer.add(new ToolBar(), { flex : 0 });


      // mainsplit, contains the editor splitpane and the info splitpane
      var mainsplit = new qx.ui.splitpane.Pane("horizontal").set({ decorator: null });
      var navigator = new TabPane(["Files","Outline"]);
      var fileTree = new FileNavigator();
      navigator.getChildren()[0].add(fileTree, {edge:0});
      navigator.getChildren()[1].add(new OutlineNavigator(), {edge:0});
      
      fileTree.getSelection().addListener("change", (event:qx.event.type.Data) =>{
         var fileName = event.getData().added[0].getLabel();
         var p = createPage(fileName, true);
         p.add(new SourceEditor(), {edge:0});
         sessionTabs.add(p);
         consoler.log("Added File");
      });
      mainsplit.add(navigator,1); // navigator
      
      
      var editorSplit =  new qx.ui.splitpane.Pane("vertical").set({ decorator: null });
      
      var infoSplit = new qx.ui.splitpane.Pane("horizontal");
      var sessionTabs = new TabPane(["file1","file2","file3", "file4"], true);
      infoSplit.set({ decorator: null });
      infoSplit.add(sessionTabs,4); // editor
      sessionTabs.getChildren().forEach((c) => {
          c.add(new SourceEditor(),{edge:0});
      });
      infoSplit.add(new TabPane(["Todo","Properties"]),1); // todo
      
      editorSplit.add(infoSplit,4);
      
      var problems = new TabPane(["Problems","Search","Console"]);
      var consoler = new Console123();
     
      editorSplit.add(problems,2); // Info
      problems.getChildren()[0].add(new ProblemsResult(),{edge:0} );
      problems.getChildren()[1].add(new ProblemsResult(),{edge:0} );
      problems.getChildren()[2].add(consoler,{edge:0} );

      
      mainsplit.add(editorSplit,4); // main area
      
      
      mainContainer.add(mainsplit, { flex : 1 });
      
       
      var statusbar = new qx.ui.toolbar.ToolBar();
      statusbar.add(new qx.ui.toolbar.Button("1:1"));
      mainContainer.add(statusbar, { flex : 0 });    
  
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
