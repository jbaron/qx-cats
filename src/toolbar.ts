/**
 * The toolbar for CATS
 */
class ToolBar extends qx.ui.toolbar.ToolBar {

    private themes = ["Modern", "Indigo", "Simple", "Classic"];

    constructor() {
        super();
        this.init();
    }

    init() {
        var iconPath = "./resource/qx/icon/Tango/16/";
        // var  iconPath = "icon/22/";

        this.themes.forEach((theme) => {
            var themeButton = new qx.ui.toolbar.Button(theme);
            themeButton.addListener("click", () => { qx.theme.manager.Meta.getInstance().setTheme(qx.theme[theme]); });
            this.add(themeButton);
        });


        var sep1 = new qx.ui.toolbar.Separator();
        var newButton = new qx.ui.toolbar.Button("New", iconPath + "actions/document-new.png");
        var sep2 = new qx.ui.toolbar.Separator();
        var copyButton = new qx.ui.toolbar.Button("Copy", iconPath + "actions/edit-copy.png");
        var cutButton = new qx.ui.toolbar.Button("Cut", iconPath + "actions/edit-cut.png");
        var pasteButton = new qx.ui.toolbar.Button("Paste", iconPath + "actions/edit-paste.png");
        var sep3 = new qx.ui.toolbar.Separator();
        var togglePane1 = new qx.ui.toolbar.Button("Toggle Pane");
        togglePane1.addListener("click", () => { 
            if (IDE.navigatorPane.isVisible()) 
                IDE.navigatorPane.exclude();    
            else
                IDE.navigatorPane.show();
        });


        var changeButton = new qx.ui.toolbar.Button("Change File");
        changeButton.addListener("click", () => { 
            IDE.sessionTabs.changed("file1");    
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
    }

}