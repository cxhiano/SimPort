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

    instr = new Instruction(
        {
            instr: 'getBoxes',
            dr: 0,
            dc: 0,
            row: 0,
            column: 0,
        },

        function(args) {
            return this.data[args.row][args.column];
        }
    );
    instr.setContextGetter(getDepot);
};
