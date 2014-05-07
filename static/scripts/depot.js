function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.data = port.field.data[row][column];
    this.lLift = new Lift(this, 0, 0);
    this.rLift = new Lift(this, 0, port.depot.columns - 1);
}

Depot.getInstance = function(row, column) {
    return Depot.prototype.depots[row][column];
};

Depot.init = function() {
    $('.lift').remove();
    Depot.prototype.depots = [];
    var d = Depot.prototype.depots;
    for (var i = 0; i < port.field.rows; ++i) {
        d.push([]);
        for (var j = 0; j < port.field.columns; ++j) {
            d[i].push(new Depot(i, j));
        }
    }
};

Depot.prototype = {
    updateBoxView: function(row, column) {
        var pos = port.getXY({
            rowDepot: this.row,
            columnDepot: this.column,
            rowBox: row,
            columnBox: column,
            });
        port.box.data = this.data[row][column];
        port.box.cascadeDraw(pos.x, pos.y);
        port.box.render();
    },

    getBoxCount: function(row, column) {
        return this.data[row][column].length;
    },

    takeBox: function(row, column) {
        var ret = this.data[row][column].pop();
        this.updateBoxView(row, column);
        return ret;
    },

    addBox: function(row, column, box) {
        this.data[row][column].push(box);
        this.updateBoxView(row, column);
    },
};
