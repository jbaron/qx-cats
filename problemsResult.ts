
class ProblemsResult extends qx.ui.table.Table {

    private createRandomRows(rowCount) {
      var rowData = [];
      for (var row = 0; row < rowCount; row++) {
        var row1 = [];
        for (var i = 0; i < 5; i++) {
          row1.push("Cell " + i + "x" + row);
        }
        rowData.push(row1);
      }
      return rowData;
    }
    
    constructor() {
       super();
       this.setDecorator(null);
      // Create the initial data
      var rowData = this.createRandomRows(20);
    
      // table model
      var tableModel = new qx.ui.table.model.Simple();
      var headers = [];
    
      for (var i = 0; i < 5; i++) {
        headers.push("Column " + i);
      }
      tableModel.setColumns(headers);
      tableModel.setData(rowData);
    
      // table
      this.setTableModel(tableModel);
      
      this.setPadding(0,0,0,0);
    
    }
}