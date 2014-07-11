     

class ProblemsResult extends qx.ui.table.Table {

    private createRandomRows(rowCount) {
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
    }
    
    constructor() {
        var tableModel = new qx.ui.table.model.Simple();
         var rowData = this.createRandomRows(20);
    
      // table model
      var headers = ["Message", "File", "Position"];
    
      tableModel.setColumns(headers);
      tableModel.setData(rowData);

      var custom:any = {
            tableColumnModel : function(obj) {
              return new qx.ui.table.columnmodel.Resize(obj);
            }
      };
       super(tableModel, custom);
       this.setDecorator(null);
      // Create the initial data
     
    
      
    
      // table
      // this.setTableModel(tableModel, custom);
      
      
      this.setPadding(0,0,0,0);
    
    }
    
    
    
    
    
}