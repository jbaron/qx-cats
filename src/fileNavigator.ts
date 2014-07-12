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
class FileNavigator extends qx.ui.tree.VirtualTree {

        static COUNT = 0;

       constructor() {
           var root = qx.data.marshal.Json.createModel(rootTop, true);
           super(root,"label", "children");
           
           this.setDecorator(null);
           
           this.setupDelegate();
       }
    
        setupDelegate() {
            var delegate = {
            bindItem : function(controller, item, index)
            {
              controller.bindDefaultProperties(item, index);
        
              controller.bindProperty("", "open", {
                converter : function(value, model, source, target) {
                  var isOpen = target.isOpen();
                  if (isOpen && !value.getLoaded()) {
                    value.setLoaded(true);
        
                   qx.event.Timer.once(function()
                    {
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
        }
    
    static createRandomData(parent) {
      for (var i = 0; i < 10; i++) {
        var node = {
          label: "Folder-" + ++FileNavigator.COUNT,
          icon: "default",
          loaded: false,
          children : [{
            label: "Loading",
            icon: "loading"
          }]
        };
    
        if (i > 3) {
          node.label = "File-" + FileNavigator.COUNT
          node.icon = "loading";
          node.loaded = true;
          node.children = [];
        }
    
        parent.getChildren().push(qx.data.marshal.Json.createModel(node, true));
      }
    }

    
}

 