function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 20;                 //px per sec
    this.data = view.canvas.data[row][column];
    this.lLift = new Lift(this, {
        column: 0,
        velocity: this.velocity,
    });
    this.rLift = new Lift(this, {
        column: 1,
        velocity: this.velocity,
    });
}

Depot.prototype = {
    getInstance: function(row, column) {
        return Depot.prototype.depots[row][column];
    },

    init: function() {
        $('.lift').remove();
        Depot.prototype.depots = [];
        var d = Depot.prototype.depots;
        for (var i = 0; i < view.canvas.rows; ++i) {
            d.push([]);
            for (var j = 0; j < view.canvas.columns; ++j) {
                d[i].push(new Depot(i, j));
            }
        }
    },

    updateBox: function(row, column, cnt) {
        console.log(this);
        var pos = view.getXY({
            rowDepot: this.row,
            columnDepot: this.column,
            rowBox: row,
            columnBox: column,
            });
        this.data[row][column] = cnt;
        view.box.data = cnt;
        view.box.cascadeDraw(pos.x, pos.y);
        view.box.render();
    },

    getBoxCount: function(row, column) {
        return this.data[row][column];
    }
};
