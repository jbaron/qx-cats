class TabPane extends qx.ui.tabview.TabView {

    constructor(tabNames: string[], close= false) {
        super();
        this.setPadding(0, 0, 0, 0);
        this.setContentPadding(1, 0, 0, 0);
        tabNames.forEach((name) => {
            this.addPage(name, close);
        });
    }

    addPage(name, close: boolean = false): qx.ui.tabview.Page {
        var tab = new qx.ui.tabview.Page(name);
        tab.setShowCloseButton(close);
        tab.setLayout(new qx.ui.layout.Canvas());
        tab.setPadding(0, 0, 0, 0);
        tab.setMargin(0, 0, 0, 0);
        tab.setDecorator(null);
        (<any>tab).getButton().setContextMenu(this.createContextMenu(tab));
        this.add(tab);
        return tab;
    }

    private createContextMenu(tab: qx.ui.tabview.Page) {
        var menu = new qx.ui.menu.Menu();
        var item1 = new qx.ui.menu.Button("Close");
        item1.addListener("execute", () => {
            this.remove(tab);
        });

        var item2 = new qx.ui.menu.Button("Close other");
        var item3 = new qx.ui.menu.Button("Close all");
        menu.add(item1);
        menu.add(item2);
        menu.add(item3);
        return menu;
    }


    changed(id) {
        var p = this.getPage(id);
        var iconPath = "./resource/qx/icon/Tango/16/";
        p.setIcon(iconPath + "status/dialog-information.png");
    }


    getPage(id: string): qx.ui.tabview.Page {
        var pages = this.getChildren();
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            console.log(page.getLabel());
            if (page.getLabel() === id) {
                return page;
            }
        }
        return null;
    }

    select(id: string) {
        var page = this.getPage(id);
        if (page) this.setSelection([page]);
    }

}
