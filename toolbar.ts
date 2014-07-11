class ToolBar extends qx.ui.toolbar.ToolBar {


    constructor() {
        super();
        this.init();
    }
    
    
    init() {
        var iconPath = "./resource/qx/icon/Tango/16/";
        // var  iconPath = "icon/22/";
        var themeButton1 = new qx.ui.toolbar.Button("Modern");
        var themeButton2 = new qx.ui.toolbar.Button("Indigo");
        var sep1 = new qx.ui.toolbar.Separator();
        var newButton = new qx.ui.toolbar.Button("New", iconPath + "actions/document-new.png");
        var sep2 = new qx.ui.toolbar.Separator();
        var copyButton = new qx.ui.toolbar.Button("Copy", iconPath + "actions/edit-copy.png");
        var cutButton = new qx.ui.toolbar.Button("Cut", iconPath + "actions/edit-cut.png");
        var pasteButton = new qx.ui.toolbar.Button("Paste", iconPath + "actions/edit-paste.png");


        themeButton1.addListener("click", () => { qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern); });

        var themeButton2 = new qx.ui.toolbar.Button("Indigo");
        themeButton2.addListener("click", () => { qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo); });

        this.add(themeButton1);
        this.add(themeButton2);
        this.add(sep1);
        this.add(newButton);
        this.add(sep2);
        this.add(copyButton);
        this.add(cutButton);
        this.add(pasteButton);
    }

}