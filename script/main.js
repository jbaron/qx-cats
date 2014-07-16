/**
* The main IDE class that contains the layout and various
* components that make up CATS
*/
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
        var fileTree = new FileNavigator(process.cwd());
        this.navigatorPane.getChildren()[0].add(fileTree, { edge: 0 });
        this.navigatorPane.getChildren()[1].add(new OutlineNavigator(), { edge: 0 });

        mainsplit.add(this.navigatorPane, 1); // navigator

        var editorSplit = new qx.ui.splitpane.Pane("vertical").set({ decorator: null });

        var infoSplit = new qx.ui.splitpane.Pane("horizontal");
        this.sessionPane = new TabPane(["file1", "file2", "file3", "file4"], true);
        infoSplit.set({ decorator: null });
        infoSplit.add(this.sessionPane, 4); // editor
        this.sessionPane.getChildren().forEach(function (c) {
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
    };
    return Ide;
})();

var IDE;

/**
* This function is called from Qooxdoo to start everything
*/
function qooxdooMain(app) {
    IDE = new Ide(app);
    IDE.layout();
}

// Lets register our main method
qx.registry.registerMainMethod(qooxdooMain);
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var fs = require("fs");
var path = require("path");

var rootTop = {
    label: "qx-cats",
    fullPath: "/Users/peter/Development/qx-cats/",
    directory: true,
    children: [{
            label: "Loading",
            icon: "loading",
            directory: false
        }],
    loaded: false
};

/**
* File navigator widget for CATS
*/
var FileNavigator = (function (_super) {
    __extends(FileNavigator, _super);
    function FileNavigator(directory) {
        var _this = this;
        _super.call(this, null, "label", "children");
        this.directoryModels = {};
        rootTop.fullPath = directory;
        rootTop.label = path.basename(directory);
        var root = qx.data.marshal.Json.createModel(rootTop, true);
        this.setModel(root);

        // this.setLabelPath("label");
        // this.setChildProperty("children");
        this.setDecorator(null);

        this.setupDelegate();
        this.setContextMenu(this.createContextMenu());
        this.setup();

        console.log("Icon path:" + this.getIconPath());
        this.addListener("dblclick", function () {
            var file = _this.getSelectedFile();
            if (file) {
                var p = IDE.sessionPane.addPage(file.getLabel(), true);
                var content = fs.readFileSync(file.getFullPath(), "UTF8");
                p.add(new SourceEditor(content), { edge: 0 });
                IDE.console.log("Added File " + file.getLabel());
            }
        });

        // Force a relaod after a close
        this.addListener("close", function (event) {
            var data = event.getData();
            data.setLoaded(false);
        });
    }
    FileNavigator.prototype.getSelectedFile = function () {
        var item = this.getSelection().getItem(0);
        if (!item)
            return null;
        if (!item.getDirectory)
            return null;
        if (!item.getDirectory()) {
            return item;
        }
        return null;
    };

    FileNavigator.prototype.getSelectedItem = function () {
        console.log(this.getSelection().getItem(0));
        var fileName = this.getSelection().getItem(0).getLabel();
        return fileName;
    };

    FileNavigator.prototype.setup = function () {
        this.setIconPath("");
        this.setIconOptions({
            converter: function (value, model) {
                // console.log(value);
                // console.log(value.getFullPath());
                if (value.getDirectory()) {
                    return "./resource/qx/icon/Tango/16/places/folder.png";
                }
                return "./resource/qx/icon/Tango/16/mimetypes/text-plain.png";
            }
        });
    };

    FileNavigator.prototype.createContextMenu = function () {
        var _this = this;
        var menu = new qx.ui.menu.Menu();
        var refreshButton = new qx.ui.menu.Button("Refresh");
        var renameButton = new qx.ui.menu.Button("Rename");

        var deleteButton = new qx.ui.menu.Button("Delete");
        deleteButton.addListener("execute", function () {
            alert("going to delete " + _this.getSelectedItem());
        });

        var newFileButton = new qx.ui.menu.Button("New File");
        var newDirButton = new qx.ui.menu.Button("New Directory");

        menu.add(refreshButton);
        menu.add(renameButton);
        menu.add(deleteButton);
        menu.add(newFileButton);
        menu.add(newDirButton);
        return menu;
    };

    FileNavigator.prototype.setupDelegate = function () {
        var self = this;
        var delegate = {
            bindItem: function (controller, item, index) {
                controller.bindDefaultProperties(item, index);

                controller.bindProperty("", "open", {
                    converter: function (value, model, source, target) {
                        var isOpen = target.isOpen();
                        if (isOpen && !value.getLoaded()) {
                            value.setLoaded(true);

                            setTimeout(function () {
                                value.getChildren().removeAll();
                                self.readDir(value);
                            }, 0);
                        }
                        return isOpen;
                    }
                }, item, index);
            }
        };
        this.setDelegate(delegate);
    };

    FileNavigator.prototype.refreshDir = function (dir) {
        var value;
        setTimeout(function () {
            // alert("refreshing tree");
            var node = {
                label: "Loading",
                fullPath: "asasasa/dss",
                directory: false
            };
            value.getChildren().removeAll();
            value.getChildren().push(qx.data.marshal.Json.createModel(node, true));
        }, 0);
    };

    /**
    * Read the files from a directory
    * @param directory The directory name that should be read
    */
    FileNavigator.prototype.readDir = function (parent) {
        var directory = parent.getFullPath();
        var files = fs.readdirSync(directory);

        // this.directoryModels[directory] = parent;
        files.forEach(function (file) {
            var fullName = path.join(directory, file);
            var stats = fs.statSync(fullName);
            var node = {
                label: file,
                fullPath: fullName,
                loaded: !stats.isDirectory(),
                directory: stats.isDirectory(),
                children: stats.isDirectory() ? [{
                        label: "Loading",
                        icon: "loading",
                        directory: false
                    }] : null
            };
            parent.getChildren().push(qx.data.marshal.Json.createModel(node, true));
        });
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
var ResultTable = (function (_super) {
    __extends(ResultTable, _super);
    function ResultTable() {
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
    ResultTable.prototype.createRandomRows = function (rowCount) {
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
    return ResultTable;
})(qx.ui.table.Table);
var Sessions = (function () {
    function Sessions(sessions) {
        this.sessions = sessions;
    }
    Sessions.prototype.containsSession = function (session) {
        return this.sessions.indexOf(session) > -1;
    };

    Sessions.prototype.add = function (session) {
        if (this.containsSession(session)) {
            IDE.sessionPane.activate;
        } else {
            this.sessions.push(session);
            IDE.sessionPane.addPage(session.name, true);
        }
    };
    return Sessions;
})();
/**
* Simple wrapper around ACE editor
*/
var SourceEditor = (function (_super) {
    __extends(SourceEditor, _super);
    function SourceEditor(content) {
        var _this = this;
        _super.call(this);
        this.addListenerOnce("appear", function () {
            var container = _this.getContentElement().getDomElement();

            // create the editor
            _this.aceEditor = ace.edit(container);
            _this.aceEditor.getSession().setMode("ace/mode/typescript");

            // this.aceEditor.getSession().setValue(this.getContent());
            _this.aceEditor.getSession();
            if (content)
                _this.setContent(content);
            _this.addListener("resize", function () {
                // use a timeout to let the layout queue apply its changes to the dom
                window.setTimeout(function () {
                    _this.aceEditor.resize();
                }, 0);
            });
            _this.setupInputHandling();
        }, this);
        this.setContextMenu(this.createContextMenu());
        this.popup = new qx.ui.popup.Popup(new qx.ui.layout.Flow());
        this.popup.add(new qx.ui.basic.Label("Code completion"));
    }
    SourceEditor.prototype.autoComplete = function () {
        // alert("auto complete");
        var cursor = this.aceEditor.getCursorPosition();
        var coords = this.aceEditor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
        this.popup.moveTo(coords.pageX, coords.pageY);
        this.popup.show();
    };

    SourceEditor.prototype.setupInputHandling = function () {
        var _this = this;
        var originalTextInput = this.aceEditor.onTextInput;
        this.aceEditor.onTextInput = function (text) {
            originalTextInput.call(_this.aceEditor, text);
            if (text === ".")
                _this.autoComplete();
        };
    };

    SourceEditor.prototype.setContent = function (value) {
        this.aceEditor.getSession().setValue(value);
    };

    SourceEditor.prototype.createContextMenu = function () {
        var menu = new qx.ui.menu.Menu();
        var item1 = new qx.ui.menu.Button("Goto Declaration");
        var item2 = new qx.ui.menu.Button("Find reference");
        menu.add(item1);
        menu.add(item2);
        return menu;
    };
    return SourceEditor;
})(qx.ui.core.Widget);
var TabPane = (function (_super) {
    __extends(TabPane, _super);
    function TabPane(tabNames, close) {
        if (typeof close === "undefined") { close = false; }
        var _this = this;
        _super.call(this);
        this.setPadding(0, 0, 0, 0);
        this.setContentPadding(1, 0, 0, 0);
        tabNames.forEach(function (name) {
            _this.addPage(name, close);
        });
    }
    TabPane.prototype.addPage = function (name, close) {
        if (typeof close === "undefined") { close = false; }
        var tab = new qx.ui.tabview.Page(name);
        tab.setShowCloseButton(close);
        tab.setLayout(new qx.ui.layout.Canvas());
        tab.setPadding(0, 0, 0, 0);
        tab.setMargin(0, 0, 0, 0);
        tab.setDecorator(null);
        tab.getButton().setContextMenu(this.createContextMenu(tab));
        this.add(tab);
        return tab;
    };

    TabPane.prototype.createContextMenu = function (tab) {
        var _this = this;
        var menu = new qx.ui.menu.Menu();
        var item1 = new qx.ui.menu.Button("Close");
        item1.addListener("execute", function () {
            _this.remove(tab);
        });

        var item2 = new qx.ui.menu.Button("Close other");
        var item3 = new qx.ui.menu.Button("Close all");
        menu.add(item1);
        menu.add(item2);
        menu.add(item3);
        return menu;
    };

    TabPane.prototype.changed = function (id) {
        var p = this.getPage(id);
        var iconPath = "./resource/qx/icon/Tango/16/";
        p.setIcon(iconPath + "status/dialog-information.png");
    };

    TabPane.prototype.getPage = function (id) {
        var pages = this.getChildren();
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            console.log(page.getLabel());
            if (page.getLabel() === id) {
                return page;
            }
        }
        return null;
    };

    TabPane.prototype.select = function (id) {
        var page = this.getPage(id);
        if (page)
            this.setSelection([page]);
    };
    return TabPane;
})(qx.ui.tabview.TabView);
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

        var changeButton = new qx.ui.toolbar.Button("Change File");
        changeButton.addListener("click", function () {
            IDE.sessionPane.changed("file1");
        });

        this.add(sep1);
        this.add(newButton);
        this.add(sep2);
        this.add(copyButton);
        this.add(cutButton);
        this.add(pasteButton);
        this.add(sep3);
        this.add(togglePane1);
        this.add(changeButton);
    };
    return ToolBar;
})(qx.ui.toolbar.ToolBar);
