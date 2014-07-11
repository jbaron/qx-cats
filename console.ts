class Console123 extends qx.ui.core.Widget {
 
    private container:HTMLElement;
 
    constructor() {
        super();
        this.setDecorator(null);
        this.addListenerOnce("appear", () => {
            this.container = this.getContentElement().getDomElement();
        });
    }
     
    log(msg:string) {
        if (this.container) {
            var t = document.createTextNode(msg);
            this.container.appendChild(t);
            this.container.appendChild(document.createElement("br"));
        }
    } 
    
    clear() {
        if (this.container) this.container.innerHTML = "";
    }
    
}