function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 10;                 //px per sec
    this.lLift = new Lift(this, {
        pos: 0,
        velocity: this.velocity,
        id: 'llift' + this.row + '_' + this.column,
    });
    this.rLift = new Lift(this, {
        pos: 1,
        velocity: this.velocity,
        id: 'rlift' + this.row + '_' + this.column,
    });
}

Depot.prototype = {
    getInstance: function(row, column) {
        return Depot.prototype.depots[row][column];
    },

    init: function() {
        Depot.prototype.depots = [];
        for (var i = 0; i < view.canvas.rows; ++i) {
            Depot.prototype.depots.push([])
            for (var j = 0; j < view.canvas.columns; ++j) {
                Depot.prototype.depots[i].push(new Depot(i, j));
            }
        }
    },
};
