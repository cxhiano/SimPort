Lift.registerInstructions = function() {
    var getLift = function(instr) {
        var d = Depot.getInstance(instr.dr, instr.dc);
        if (instr.lift === 'l') {
            return d.lLift;
        } else if (instr.lift === 'r') {
            return d.rLift;
        }
        throw 'can not find lift' + JSON.stringify(instr);
    };

    var instr = new Instruction(
        {
            instr: 'hMove',
            dr: 0,
            dc: 0,
            lift: 'l',
            column: 4,
        }, 

        function(args) {
            this.addJob(this.hMove.bind(this, args.column));
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
            this.addJob(this.vMove.bind(this, args.row));
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
            this.addJob(this.pickUp.bind(this)); 
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
            this.addJob(this.putDown.bind(this));
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
                row: this.lift.pos,
                column: this.arm.pos,
            };
        }
    );
    instr.setContextGetter(getLift);

    instr = new Instruction(
        {
            instr: 'getCarry',
            dr: 0,
            dc: 0,
            lift: 'l',
        },

        function(args) {
            return this.carry;
        }
    );
    instr.setContextGetter(getLift);
};
