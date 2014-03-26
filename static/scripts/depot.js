function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 2;
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
};
