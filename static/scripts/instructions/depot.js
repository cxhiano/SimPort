var getDepot = function(args) {
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
        return { status: Instruction.status.OK };
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
        return {
            status: Instrution.status.OK,
            box: this.takeBox(args.row, args.column),
        };
    }
);
instr.setContextGetter(getDepot);
instr.setPreCondition(function(args) {
    return this.getBoxCount(args.row, args.column) > 0;
});

instr = new Instruction(
    {
        instr: 'getBoxes',
        dr: 0,
        dc: 0,
    },

    function(args) {
        return {
            status: Instruction.status.OK,
            boxes: this.data,
        };
    }
);
instr.setContextGetter(getDepot);

instr = new Instruction(
    {
        instr: 'setBoxes',
        dr: 0,
        dc: 0,
        data: [[['boxA', 'boxB', 'boxC'], [], [], [], []],
               [[], [], [], [], []],
               [[], [], [], [], []],
               [[], [], [], [], []],
               [[], [], [], [], ['boxD']]],
    },

    function(args) {
        pos = port.field.getXY(args.dr, args.dc);
        this.data = args.data;
        port.depot.data = this.data;
        port.depot.cascadeDraw(pos.x, pos.y);
        port.depot.render();
        return { status: Instruction.status.OK };
    }
);
instr.setContextGetter(getDepot);
/*
getColbySide = function(side) {
    return (side === 'l')?0:port.depot.columns;
};

instr = new Instruction({
    instr: 'import',
    side: 'l',
    box: 'boxA',
    },

    function(args) {
        var row = args.row,
            column = getColbySide(args.side);
        this.addBox(row, column, args.box);
        return { status: Instruction.status.OK };
    }
);
instr.setContextGetter(getDepot);
instr.setPreCondition(function(args) {
    var row = args.row,
        column = getColbySide(args.side);
    if (this.getBoxCount(row, column) > 0) return false;
    var q = Quest.activatedBoxDict[args.box];
    if (q === undefined || q.operation === 'export') return false;
    return true;
});

instr = new Instruction({
    instr: 'export',
    side: 'r',
    row: 1,
    },

    function(args) {

    }
);
instr.setContextGetter(getDepot);
instr.setPreCondition(function(args) {

});
*/