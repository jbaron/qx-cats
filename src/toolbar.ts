class ToolBar extends qx.ui.toolbar.ToolBar {

    private themes = ["Modern", "Indigo" , "Simple"];

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


        this.add(sep1);
        this.add(newButton);
        this.add(sep2);
        this.add(copyButton);
        this.add(cutButton);
        this.add(pasteButton);
    }

}