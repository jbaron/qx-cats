
    var COL_COUNT = 5;
    var ROW_COUNT = 20;


    function createRandomRows(rowCount)
    {
      var rowData = [];
      for (var row = 0; row < rowCount; row++)
      {
        var row1 = [];
        for (var i = 0; i < this.COL_COUNT; i++) {
          row1.push("Cell " + i + "x" + row);
        }
        rowData.push(row1);
      }
      return rowData;
    }

    function createTable() {
      // Create the initial data
      var rowData = this.createRandomRows(this.ROW_COUNT);

      // table model
      var tableModel = this._tableModel = new qx.ui.table.model.Simple();
      var headers = [];

      for (var i = 0; i < this.COL_COUNT; i++) {
        headers.push("Column " + i);
      }
      tableModel.setColumns(headers);
      tableModel.setData(rowData);

      // table
      var table = new qx.ui.table.Table(tableModel);
      table.setPadding(0,0,0,0);

      return table;
    }
  


function createTree() {
    // create the tree
    var tree = new qx.ui.tree.Tree();
    tree.setDecorator(null);
    tree.setPadding(0,0,0,0);
    
    // create and set the tree root
    var root = new qx.ui.tree.TreeFolder("Desktop");
    tree.setRoot(root);
    
    for (var f=0;f<10;f++) {
        var f1 = new qx.ui.tree.TreeFolder("Folder" + f);
        root.add(f1);
        // create a third layer
        for (var i=0;i<10;i++) {
           var f11 = new qx.ui.tree.TreeFile("File" + i + ".png"); 
           f1.add(f11);    
        }
}

// open the folders
root.setOpen(true);
f1.setOpen(true);
return tree;
}

class TabPane extends qx.ui.tabview.TabView {

    private tabs = [];
    
    constructor(tabNames:string[],close=false) {
        super();
        this.setPadding(0,0,0,0);
        this.setContentPadding(1,0,0,0);
        tabNames.forEach((name) => {
            var tab = new qx.ui.tabview.Page(name);
            tab.setShowCloseButton(close);
            tab.setLayout(new qx.ui.layout.Canvas());
            tab.setPadding(0,0,0,0);
            tab.setMargin(0,0,0,0);
            tab.setDecorator(null);
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


function qooxdooMain(app: qx.application.Standalone) {
     var doc = <qx.ui.container.Composite>app.getRoot();
   
    // container layout
      var layout = new qx.ui.layout.VBox();

      // main container
      var mainContainer = new qx.ui.container.Composite(layout);
      doc.add(mainContainer, { edge : 0 });

      // qooxdoo header
      
      // toolbar
      var toolbar = new qx.ui.toolbar.ToolBar();
     
      var themeButton1 = new qx.ui.toolbar.Button("Modern");
      themeButton1.addListener("click", () =>{ qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);});
      
      var themeButton2 = new qx.ui.toolbar.Button("Indigo");
      themeButton2.addListener("click", () =>{ qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);});
      
      toolbar.add(themeButton1);
      toolbar.add(themeButton2);
      mainContainer.add(toolbar, { flex : 0 });


      // mainsplit, contains the editor splitpane and the info splitpane
      var mainsplit = new qx.ui.splitpane.Pane("horizontal").set({ decorator: null });
      var navigator = new TabPane(["Files","Outline"]);
      navigator.getChildren()[0].add(createTree(), {edge:0});
      navigator.getChildren()[1].add(createTree(), {edge:0});
      
      mainsplit.add(navigator,1); // navigator
      
      
      var editorSplit =  new qx.ui.splitpane.Pane("vertical").set({ decorator: null });
      
      var infoSplit = new qx.ui.splitpane.Pane("horizontal");
      infoSplit.set({ decorator: null });
      infoSplit.add(new TabPane(["file1","file2","file3", "file4"], true),4); // editor
      
      infoSplit.add(new TabPane(["Todo","Properties"]),1); // todo
      
      editorSplit.add(infoSplit,4);
      
      var problems = new TabPane(["Problems","Search","Console"]);
      editorSplit.add(problems,1); // Info
      problems.getChildren()[0].add(createTable(),{edge:0} );
      
      mainsplit.add(editorSplit,4); // main area
      
      
      mainContainer.add(mainsplit, { flex : 1 });
      
       
      var statusbar = new qx.ui.toolbar.ToolBar();
      statusbar.add(new qx.ui.toolbar.Button("1:1"));
      mainContainer.add(statusbar, { flex : 0 });    
  
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
