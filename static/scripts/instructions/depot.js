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
        row: 0,
        column: 0,
    },

    function(args) {
        return {
            status: Instruction.status.OK,
            boxes: this.data[args.row][args.column],
        };
    }
);
instr.setContextGetter(getDepot);

instr = new Instruction(
    {
        instr: 'setDepotBoxes',
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
