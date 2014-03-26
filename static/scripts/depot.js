function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 2;
    this.lLift = new Lift(this, {
        xy: this.getXY(0),
        velocity: this.velocity,
    });
    this.rLift = new Lift(this, {
        xy: this.getXY(view.depot.columns - 1),
        velocity: this.velocity,
    });
}

Depot.prototype = {
    getXY: function(column) {
        return view.getXY({
            rowDepot: this.row,
            columnDepot: this.column,
            rowBox: 0,
            columnBox: column
        });
    },
};
