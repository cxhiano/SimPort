function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 20;                 //px per sec
    this.data = port.field.data[row][column];
    this.lLift = new Lift(this, 0, 1);
    this.rLift = new Lift(this, 1, 2);
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
    },

Depot.instrHandler = function(instr) {
    var d = Depot.getInstance(instr['dr'], instr['dc']);

    d[instr['instr']](instr);
};

Depot.prototype = {
    updateBox: function(row, column) {
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

    addBox: function(args) {
        if (this.getBoxCount(args.row, args.column) < 6) {
            this.data[args.row][args.column].push(args.box);
            this.updateBox(args.row, args.column);
            return true;
        }
        return false;
    },

    takeBox: function(args) {
        if (this.getBoxCount(args.row, args.column) > 0) {
            var ret = this.data[args.row][args.column].pop();
            this.updateBox(args.row, args.column);
            return ret;
        }
        return -1;
    },
};
