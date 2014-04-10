function Depot(row, column) {
    this.row = row;
    this.column = column;
    this.velocity = 20;                 //px per sec
    this.data = view.canvas.data[row][column];
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
        for (var i = 0; i < view.canvas.rows; ++i) {
            d.push([]);
            for (var j = 0; j < view.canvas.columns; ++j) {
                d[i].push(new Depot(i, j));
            }
        }
    },

Depot.instrHandler = function(instr) {
    var d = Depot.getInstance(instr['dr'], instr['dc']);

    d[instr['instr']](instr);
};

Depot.instrUpdater = new Updater('instr/get', Depot.instrHandler);

Depot.prototype = {
    updateBox: function(row, column) {
        var pos = view.getXY({
            rowDepot: this.row,
            columnDepot: this.column,
            rowBox: row,
            columnBox: column,
            });
        view.box.data = this.data[row][column];
        view.box.cascadeDraw(pos.x, pos.y);
        view.box.render();
    },

    getBoxCount: function(row, column) {
        return this.data[row][column].length;
    },

    addBox: function(row, column, box) {
        if (this.getBoxCount(row, column) < 6) {
            this.data[row][column].push(box);
            this.updateBox(row, column);
            return true;
        }
        return false;
    },

    takeBox: function(row, column) {
        if (this.getBoxCount(row, column) > 0) {
            var ret = this.data[row][column].pop();
            this.updateBox(row, column);
            return ret;
        }
        return -1;
    },
};
