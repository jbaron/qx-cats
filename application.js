var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var COL_COUNT = 5;
var ROW_COUNT = 20;
var COUNT = 0;

/**
* Dynamic tree to mimic the file navigation.
*/
function createDynamicTree() {
    var count = 0;

    var rootTop = {
        label: "Root",
        children: [],
        icon: "default",
        loaded: true
    };

    var root = qx.data.marshal.Json.createModel(rootTop, true);
    this.createRandomData(root);

    var tree = new qx.ui.tree.VirtualTree(root, "label", "children");

    tree.setIconPath("icon");
    tree.setIconOptions({
        converter: function (value, model) {
            if (value == "default") {
                if (model.getChildren != null) {
                    return "icon/22/places/folder.png";
                } else {
                    return "icon/22/mimetypes/office-document.png";
                }
            } else {
                return "demobrowser/demo/icons/loading22.gif";
            }
        }
    });

    var that = this;
    var delegate = {
        bindItem: function (controller, item, index) {
            controller.bindDefaultProperties(item, index);

            controller.bindProperty("", "open", {
                converter: function (value, model, source, target) {
                    var isOpen = target.isOpen();
                    if (isOpen && !value.getLoaded()) {
                        value.setLoaded(true);

                        qx.event.Timer.once(function () {
                            value.getChildren().removeAll();
                            this.createRandomData(value);
                        }, that, 500);

                        setTimeout(function () {
                            value.setLoaded(false);
                            value.getChildren().removeAll();
                        }, 5000);
                    }

                    return isOpen;
                }
            }, item, index);
        }
    };
    tree.setDelegate(delegate);
    return tree;
}

function createRandomData(parent) {
    for (var i = 0; i < 20; i++) {
        var node = {
            label: "Item " + COUNT++,
            icon: "default",
            loaded: true
        };

        if (Math.random() > 0.3) {
            node["loaded"] = false;
            node["children"] = [{
                    label: "Loading",
                    icon: "loading"
                }];
        }

        parent.getChildren().push(qx.data.marshal.Json.createModel(node, true));
    }
}

function createRandomRows(rowCount) {
    var rowData = [];
    for (var row = 0; row < rowCount; row++) {
        var row1 = [];
        for (var i = 0; i < this.COL_COUNT; i++) {
            row1.push("Cell " + i + "x" + row);
        }
        rowData.push(row1);
    }
    return rowData;
}

/**
* Create a table to mimic search results
*/
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
    table.setPadding(0, 0, 0, 0);

    return table;
}

/**
* Create a simple Tree to mimic outline functionality
*/
function createTree() {
    // create the tree
    var tree = new qx.ui.tree.Tree();
    tree.setDecorator(null);
    tree.setPadding(0, 0, 0, 0);
    tree.setHideRoot(true);

    // create and set the tree root
    var root = new qx.ui.tree.TreeFolder("Desktop");
    tree.setRoot(root);

    for (var f = 0; f < 10; f++) {
        var f1 = new qx.ui.tree.TreeFolder("Class-" + f);
        root.add(f1);

        for (var i = 0; i < 10; i++) {
            var f11 = new qx.ui.tree.TreeFile("Method-" + i);
            f1.add(f11);
        }
    }

    // open the folders
    root.setOpen(true);
    f1.setOpen(true);
    return tree;
}

function createPage(name, close) {
    var tab = new qx.ui.tabview.Page(name);
    tab.setShowCloseButton(close);
    tab.setLayout(new qx.ui.layout.Canvas());
    tab.setPadding(0, 0, 0, 0);
    tab.setMargin(0, 0, 0, 0);
    tab.setDecorator(null);
    return tab;
}

var TabPane = (function (_super) {
    __extends(TabPane, _super);
    function TabPane(tabNames, close) {
        if (typeof close === "undefined") { close = false; }
        var _this = this;
        _super.call(this);
        this.tabs = [];
        this.setPadding(0, 0, 0, 0);
        this.setContentPadding(1, 0, 0, 0);
        tabNames.forEach(function (name) {
            var tab = createPage(name, close);
            _this.add(tab);
            _this.tabs.push(tab);
        });
    }
    return TabPane;
})(qx.ui.tabview.TabView);

var MyPane = (function (_super) {
    __extends(MyPane, _super);
    function MyPane(color) {
        _super.call(this);
        this.set({ backgroundColor: color });

        this.addListener("dblclick", function (e) {
        });
    }
    return MyPane;
})(qx.ui.core.Widget);

/**
* Insert the ACE editor
*/
function createEditor() {
    var editor = new qx.ui.core.Widget();
    editor.addListenerOnce("appear", function () {
        var container = editor.getContentElement().getDomElement();

        // create the editor
        var aceEditor = ace.edit(container);
        aceEditor.getSession().setMode("ace/mode/typescript");
        editor.addListener("resize", function () {
            // use a timeout to let the layout queue apply its changes to the dom
            window.setTimeout(function () {
                aceEditor.resize();
            }, 0);
        });
    }, this);
    return editor;
}

/**
* Setup the main layout
*/
function qooxdooMain(app) {
    var doc = app.getRoot();

    // container layout
    var layout = new qx.ui.layout.VBox();

    // main container
    var mainContainer = new qx.ui.container.Composite(layout);
    doc.add(mainContainer, { edge: 0 });

    // qooxdoo header
    // toolbar
    var toolbar = new qx.ui.toolbar.ToolBar();

    var themeButton1 = new qx.ui.toolbar.Button("Modern");
    themeButton1.addListener("click", function () {
        qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
    });

    var themeButton2 = new qx.ui.toolbar.Button("Indigo");
    themeButton2.addListener("click", function () {
        qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
    });

    toolbar.add(themeButton1);
    toolbar.add(themeButton2);
    mainContainer.add(toolbar, { flex: 0 });

    // mainsplit, contains the editor splitpane and the info splitpane
    var mainsplit = new qx.ui.splitpane.Pane("horizontal").set({ decorator: null });
    var navigator = new TabPane(["Files", "Outline"]);
    var fileTree = createDynamicTree();
    navigator.getChildren()[0].add(fileTree, { edge: 0 });
    navigator.getChildren()[1].add(createTree(), { edge: 0 });

    fileTree.addListener("changeSelection", function () {
        var p = createPage("New file", true);
        p.add(createEditor(), { edge: 0 });
        sessionTabs.add(p);
    });
    mainsplit.add(navigator, 1); // navigator

    var editorSplit = new qx.ui.splitpane.Pane("vertical").set({ decorator: null });

    var infoSplit = new qx.ui.splitpane.Pane("horizontal");
    var sessionTabs = new TabPane(["file1", "file2", "file3", "file4"], true);
    infoSplit.set({ decorator: null });
    infoSplit.add(sessionTabs, 4); // editor
    sessionTabs.getChildren().forEach(function (c) {
        c.add(createEditor(), { edge: 0 });
    });
    infoSplit.add(new TabPane(["Todo", "Properties"]), 1); // todo

    editorSplit.add(infoSplit, 4);

    var problems = new TabPane(["Problems", "Search", "Console"]);
    editorSplit.add(problems, 1); // Info
    problems.getChildren()[0].add(createTable(), { edge: 0 });

    mainsplit.add(editorSplit, 4); // main area

    mainContainer.add(mainsplit, { flex: 1 });

    var statusbar = new qx.ui.toolbar.ToolBar();
    statusbar.add(new qx.ui.toolbar.Button("1:1"));
    mainContainer.add(statusbar, { flex: 0 });
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
