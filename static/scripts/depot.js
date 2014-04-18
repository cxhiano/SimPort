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
};

Depot.registerInstructions = function() {
    getDepot = function(args) {
        return Depot.getInstance(args.dr, args.dc);
    };

    var instr;

    instr = new Instruction(
        {
            instr: 'addBox',
            dr: 0,
            dc: 0,
            row: 0,
            column: 0,
            box: 'a',
        },

        function(args) {
            this.addBox(args.row, args.column, args.box);
        }
    );
    instr.setContextGetter(getDepot);
    instr.setPreCondition(function(args) {
        return this.getBoxCount(args.row, args.column) < 6;
    });

    instr = new Instruction(
        {
            instr: 'takeBox',
            dr: 0,
            dc: 0,
            row: 0,
            column: 0,
        },

        function(args) {
            return this.takeBox(args.row, args.column);
        }
    );
    instr.setContextGetter(getDepot);
    instr.setPreCondition(function(args) {
        return this.getBoxCount(args.row, args.column) > 0;
    });
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

    takeBox: function(row, column) {
        var ret = this.data[row][column].pop();
        this.updateBox(row, column);
        return ret;
    },

    addBox: function(row, column, box) {
        this.data[row][column].push(box);
        this.updateBox(row, column);
    },
};
