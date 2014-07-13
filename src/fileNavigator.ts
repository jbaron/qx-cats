var fs = require("fs");
var path = require("path");

var rootTop = {
    label: "qx-cats",
    fullPath: "/Users/peter/Development/qx-cats/",
    directory: true,
    children: [{
        label: "Loading",
        icon: "loading",
        directory : false 
    }],
    loaded: false
};

/**
 * File navigator widget for CATS
 */
class FileNavigator extends qx.ui.tree.VirtualTree {

    static COUNT = 0;

    constructor(directory) {
        rootTop.fullPath = directory;
        rootTop.label = path.basename(directory);
        var root = qx.data.marshal.Json.createModel(rootTop, true);
        super(root, "label", "children");

        this.setDecorator(null);

        this.setupDelegate();
        this.setContextMenu(this.createContextMenu());
        this.setup();

        console.log("Icon path:" + this.getIconPath());    
        this.addListener("dblclick", () => {
            var fileName = this.getSelectedFile();
            if (fileName) {
                var p = IDE.sessionTabs.addPage(fileName, true);
                p.add(new SourceEditor(), { edge: 0 });
                IDE.console.log("Added File " + fileName);
            }
        });

    }

    getSelectedFile() {
        var item = this.getSelection().getItem(0);
        if (! item) return null;
        if (! item.getDirectory) return null;
        if (! item.getDirectory()) {
            return item.getLabel();
        }
        return null;
    }

    getSelectedItem() {
        console.log(this.getSelection().getItem(0));
        var fileName = this.getSelection().getItem(0).getLabel();
        return fileName;
    }

    
    setup() {
        
        this.setIconPath("");
        this.setIconOptions({
            converter : function(value, model) {
               // console.log(value);
               // console.log(value.getFullPath());
               
               if (value.getDirectory()) {
                   return "./resource/qx/icon/Tango/16/places/folder.png";
               }
               return "./resource/qx/icon/Tango/16/mimetypes/text-plain.png";

            }
      });

    }


    private createContextMenu() {
        var menu = new qx.ui.menu.Menu();
        var refreshButton = new qx.ui.menu.Button("Refresh");
        var renameButton = new qx.ui.menu.Button("Rename");
        
        var deleteButton = new qx.ui.menu.Button("Delete");
        deleteButton.addListener("execute", () => { alert("going to delete " + this.getSelectedItem()); });

        var newFileButton = new qx.ui.menu.Button("New File");
        var newDirButton = new qx.ui.menu.Button("New Directory");
        
        menu.add(refreshButton);
        menu.add(renameButton);
        menu.add(deleteButton);
        menu.add(newFileButton);
        menu.add(newDirButton);
        return menu;
    }

    setupDelegate() {
        var delegate = {
            bindItem: function(controller, item, index) {
                controller.bindDefaultProperties(item, index);

                controller.bindProperty("", "open", {
                    converter: function(value, model, source, target) {
                        var isOpen = target.isOpen();
                        if (isOpen && !value.getLoaded()) {
                            value.setLoaded(true);

                            setTimeout(function() {
                                value.getChildren().removeAll();
                                FileNavigator.readDir(value);
                            }, 0);


                        }

                        return isOpen;
                    }
                }, item, index);
            }
        };
        this.setDelegate(delegate);
    }

    /**
     * Read the files from a directory
     * @param directory The directory name that should be read
     */ 
    static readDir(parent){
            var directory = parent.getFullPath();
            var files:string[] = fs.readdirSync(directory);
            files.forEach((file) => {
                var fullName = path.join(directory, file);
                var stats = fs.statSync(fullName);
                var node = {
                   label:file,
                   fullPath: fullName,
                   loaded : ! stats.isDirectory(),
                   directory: stats.isDirectory(),
                   children: stats.isDirectory() ? [{
                        label: "Loading",
                        icon: "loading",
                        directory: false
                    }] : null   
                };
                parent.getChildren().push(qx.data.marshal.Json.createModel(node, true));
            });
            
    }

}

