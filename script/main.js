var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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

var Ide = (function () {
    function Ide(app) {
        this.doc = app.getRoot();
    }
    Ide.prototype.layout = function () {
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
        var fileTree = new FileNavigator();
        this.navigatorPane.getChildren()[0].add(fileTree, { edge: 0 });
        this.navigatorPane.getChildren()[1].add(new OutlineNavigator(), { edge: 0 });

        fileTree.getSelection().addListener("change", function (event) {
            var fileName = event.getData().added[0].getLabel();
            var p = createPage(fileName, true);
            p.add(new SourceEditor(), { edge: 0 });
            sessionTabs.add(p);
            consoler.log("Added File " + fileName);
        });
        mainsplit.add(this.navigatorPane, 1); // navigator

        var editorSplit = new qx.ui.splitpane.Pane("vertical").set({ decorator: null });

        var infoSplit = new qx.ui.splitpane.Pane("horizontal");
        var sessionTabs = new TabPane(["file1", "file2", "file3", "file4"], true);
        infoSplit.set({ decorator: null });
        infoSplit.add(sessionTabs, 4); // editor
        sessionTabs.getChildren().forEach(function (c) {
            c.add(new SourceEditor(), { edge: 0 });
        });
        infoSplit.add(new TabPane(["Todo", "Properties"]), 1); // todo

        editorSplit.add(infoSplit, 4);

        // Setup Problems section
        this.problemPane = new TabPane(["Console", "Problems", "Search"]);
        var consoler = new Console123();

        editorSplit.add(this.problemPane, 2); // Info
        this.problemPane.getChildren()[0].add(consoler, { edge: 0 });
        this.problemPane.getChildren()[1].add(new ProblemsResult(), { edge: 0 });
        this.problemPane.getChildren()[2].add(new ProblemsResult(), { edge: 0 });

        mainsplit.add(editorSplit, 4); // main area

        mainContainer.add(mainsplit, { flex: 1 });

        // Setup status bar
        this.statusBar = new qx.ui.toolbar.ToolBar();
        this.statusBar.add(new qx.ui.toolbar.Button("1:1"));
        mainContainer.add(this.statusBar, { flex: 0 });
    };
    return Ide;
})();

var IDE;

/**
* Setup the main layout
*/
function qooxdooMain(app) {
    IDE = new Ide(app);
    IDE.layout();
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
/**
* Basic logging widget that can be used to write
* logging information that are of interest to the user.
*
*/
var Console123 = (function (_super) {
    __extends(Console123, _super);
    function Console123() {
        var _this = this;
        _super.call(this);
        console.log("Scroll container123");

        this.setDecorator(null);
        var w = new qx.ui.core.Widget();
        this.add(w);

        this.addListenerOnce("appear", function () {
            _this.container = w.getContentElement().getDomElement();
        });
        this.setContextMenu(this.createContextMenu());
    }
    Console123.prototype.log = function (msg, printTime, severity) {
        if (typeof printTime === "undefined") { printTime = false; }
        if (typeof severity === "undefined") { severity = 0; }
        if (this.container) {
            var prefix = "";
            if (printTime) {
                var dt = new Date();
                prefix = dt.toLocaleTimeString() + " ";
            }
            this.container.innerText += prefix + msg + "\n";
            this.container.scrollTop = this.container.scrollHeight; // Scroll to bottom
            // var t = document.createTextNode(prefix + msg);
            // this.container.appendChild(t);
            // this.container.appendChild(document.createElement("br"));
        }
    };

    Console123.prototype.createContextMenu = function () {
        var _this = this;
        var menu = new qx.ui.menu.Menu();
        var item1 = new qx.ui.menu.Button("Clear");
        item1.addListener("execute", function () {
            _this.clear();
        });
        menu.add(item1);
        return menu;
    };

    Console123.prototype.clear = function () {
        if (this.container)
            this.container.innerHTML = "";
    };
    return Console123;
})(qx.ui.container.Scroll);
var rootTop = {
    label: "Root",
    children: [{
            label: "Loading",
            icon: "loading"
        }],
    icon: "default",
    loaded: false
};

/**
* File navigator widget for CATS
*/
var FileNavigator = (function (_super) {
    __extends(FileNavigator, _super);
    function FileNavigator() {
        var root = qx.data.marshal.Json.createModel(rootTop, true);
        _super.call(this, root, "label", "children");

        this.setDecorator(null);

        this.setupDelegate();
    }
    FileNavigator.prototype.setupDelegate = function () {
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
                                FileNavigator.createRandomData(value);
                            }, this, 500);
                        }

                        return isOpen;
                    }
                }, item, index);
            }
        };
        this.setDelegate(delegate);
    };

    FileNavigator.createRandomData = function (parent) {
        for (var i = 0; i < 10; i++) {
            var node = {
                label: "Folder-" + ++FileNavigator.COUNT,
                icon: "default",
                loaded: false,
                children: [{
                        label: "Loading",
                        icon: "loading"
                    }]
            };

            if (i > 3) {
                node.label = "File-" + FileNavigator.COUNT;
                node.icon = "loading";
                node.loaded = true;
                node.children = [];
            }

            parent.getChildren().push(qx.data.marshal.Json.createModel(node, true));
        }
    };
    FileNavigator.COUNT = 0;
    return FileNavigator;
})(qx.ui.tree.VirtualTree);
/**
* Create a simple Tree to mimic outline functionality
*/
var OutlineNavigator = (function (_super) {
    __extends(OutlineNavigator, _super);
    function OutlineNavigator() {
        _super.call(this);

        this.setDecorator(null);
        this.setPadding(0, 0, 0, 0);
        this.setHideRoot(true);

        // create and set the tree root
        var root = new qx.ui.tree.TreeFolder("Desktop");
        this.setRoot(root);

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
    }
    return OutlineNavigator;
})(qx.ui.tree.Tree);
/**
* This table displays problems and search result
*/
var ProblemsResult = (function (_super) {
    __extends(ProblemsResult, _super);
    function ProblemsResult() {
        var tableModel = new qx.ui.table.model.Simple();
        var rowData = this.createRandomRows(20);

        // table model
        var headers = ["Message", "File", "Position"];

        tableModel.setColumns(headers);
        tableModel.setData(rowData);

        var custom = {
            tableColumnModel: function (obj) {
                return new qx.ui.table.columnmodel.Resize(obj);
            }
        };
        _super.call(this, tableModel, custom);
        this.setDecorator(null);

        this.setPadding(0, 0, 0, 0);
    }
    ProblemsResult.prototype.createRandomRows = function (rowCount) {
        var rowData = [];
        for (var row = 0; row < rowCount; row++) {
            var row1 = [
                "Cannot find method XYZ",
                "File-2",
                "12:10"
            ];
            rowData.push(row1);
        }
        return rowData;
    };
    return ProblemsResult;
})(qx.ui.table.Table);
/**
* Simple wrapper around ACE editor
*/
var SourceEditor = (function (_super) {
    __extends(SourceEditor, _super);
    function SourceEditor() {
        var _this = this;
        _super.call(this);
        this.addListenerOnce("appear", function () {
            var container = _this.getContentElement().getDomElement();

            // create the editor
            var aceEditor = ace.edit(container);
            aceEditor.getSession().setMode("ace/mode/typescript");
            aceEditor.getSession().setValue(_this.getContent());
            _this.addListener("resize", function () {
                // use a timeout to let the layout queue apply its changes to the dom
                window.setTimeout(function () {
                    aceEditor.resize();
                }, 0);
            });
        }, this);
    }
    SourceEditor.prototype.getContent = function () {
        try  {
            var fs = require("fs");
            return fs.readFileSync("./src/application.ts", "UTF8");
        } catch (err) {
            return "var i = 0;\n";
        }
    };
    return SourceEditor;
})(qx.ui.core.Widget);
/**
* The toolbar for CATS
*/
var ToolBar = (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        _super.call(this);
        this.themes = ["Modern", "Indigo", "Simple", "Classic"];
        this.init();
    }
    ToolBar.prototype.init = function () {
        var _this = this;
        var iconPath = "./resource/qx/icon/Tango/16/";

        // var  iconPath = "icon/22/";
        this.themes.forEach(function (theme) {
            var themeButton = new qx.ui.toolbar.Button(theme);
            themeButton.addListener("click", function () {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme[theme]);
            });
            _this.add(themeButton);
        });

        var sep1 = new qx.ui.toolbar.Separator();
        var newButton = new qx.ui.toolbar.Button("New", iconPath + "actions/document-new.png");
        var sep2 = new qx.ui.toolbar.Separator();
        var copyButton = new qx.ui.toolbar.Button("Copy", iconPath + "actions/edit-copy.png");
        var cutButton = new qx.ui.toolbar.Button("Cut", iconPath + "actions/edit-cut.png");
        var pasteButton = new qx.ui.toolbar.Button("Paste", iconPath + "actions/edit-paste.png");
        var sep3 = new qx.ui.toolbar.Separator();
        var togglePane1 = new qx.ui.toolbar.Button("Toggle Pane");
        togglePane1.addListener("click", function () {
            if (IDE.navigatorPane.isVisible())
                IDE.navigatorPane.exclude();
            else
                IDE.navigatorPane.show();
        });

        this.add(sep1);
        this.add(newButton);
        this.add(sep2);
        this.add(copyButton);
        this.add(cutButton);
        this.add(pasteButton);
        this.add(sep3);
        this.add(togglePane1);
    };
    return ToolBar;
})(qx.ui.toolbar.ToolBar);
