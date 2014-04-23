var getLift = function(instr) {
    var d = Depot.getInstance(instr.dr, instr.dc);
    if (instr.lift === 'l') {
        return d.lLift;
    } else if (instr.lift === 'r') {
        return d.rLift;
    }
    throw new Error('can not find lift' + JSON.stringify(instr));
};

var instr = new Instruction({
    instr: 'hMove',
    dr: 0,
    dc: 0,
    lift: 'l',
    column: 4,
    }, function(args) {
        var job = {
            run: this.hMove.bind(this, args.column),
            runTimeCheckers: {
                'Cannot crash arms': function(args) {
                    return ((this === this.depot.lLift && args.column >= this.depot.rLift.arm.pos) ||
                            (this === this.depot.rLift && args.column <= this.depot.lLift.arm.pos));
                },
            },
            args: args,
        };
        this.addJob(job);
        return { status: Instruction.status.RETURN_AT_RUNTIME };
    }
);
instr.setContextGetter(getLift);
instr.setPreCondition(function(args) {
    return args.column >= 0 && args.column < port.depot.columns;
});

instr = new Instruction(
    {
        instr: 'vMove',
        dr: 0,
        dc: 0,
        lift: 'r',
        row: 3,
    },

    function(args) {
        var job = {
            run: this.vMove.bind(this, args.row),
            runTimeCheckers: {},
            args: args,
        };
        this.addJob(job);
        return { status: Instruction.status.RETURN_AT_RUNTIME };
    }
);
instr.setContextGetter(getLift);
instr.setPreCondition(function(args) {
    return args.row >= 0 && args.row < port.depot.rows;
});

instr = new Instruction(
    {
        instr: 'pickup',
        dr: 0,
        dc: 0,
        lift: 'l',
    },

    function(args) {
        var job = {
            run: this.pickUp.bind(this, args.row),
            runTimeCheckers: {
                'Already picked a box': function(args) {
                    return this.carry != -1;
                },

                'No box to pick': function(args) {
                    return this.depot.getBoxCount(this.lift.pos, this.arm.pos) === 0;
                },
            },
            args: args,
        };
        this.addJob(job);
        return { status: Instruction.status.RETURN_AT_RUNTIME };
    }
);
instr.setContextGetter(getLift);

instr = new Instruction(
    {
        instr: 'putdown',
        dr: 0,
        dc: 0,
        lift: 'r',
    },

    function(args) {
        var job = {
            run: this.putDown.bind(this, args.row),
            runTimeCheckers: {
                'Empty hand': function(args) {
                    return this.carry === -1;
                },

                'Cannot put down, stack full!': function(args) {
                    return this.depot.getBoxCount(this.lift.pos, this.arm.pos) === port.maxStacks;
                },
            },
            args: args,
        };
        this.addJob(job);
        return { status: Instruction.status.RETURN_AT_RUNTIME };
    }
);
instr.setContextGetter(getLift);

instr = new Instruction(
    {
        instr: 'getPosition',
        dr: 0,
        dc: 0,
        lift: 'l',
    },

    function(args) {
        return {
            status: Instruction.status.OK,
            row: this.lift.pos,
            column: this.arm.pos,
        };
    }
);
instr.setContextGetter(getLift);
