var instr = new Instruction(
    {
        instr: 'getExample',
        name: 'pickUp',
    },

    function(args) {
        var instr = Instruction.instrs[args.name];
        if (instr) {
            return {
                'status': Instruction.status.OK,
                'example': instr.example,
            };
        } else {
            return {
                'status': Instruction.status.OK,
                'example': 'No Such Instruction',
            };
        }
    }
);

instr = new Instruction(
    {
        instr: 'list',
    },

    function(args) {
        var ret = [];
        for (var item in Instruction.instrs) {
            ret.push(item);
        }
        return {
            status: Instruction.status.OK,
            instructions: ret,
        };
    }
);

instr = new Instruction(
    {
        instr: 'listStatus',
    }, function(args) {
        return {
            status: Instruction.status.OK,
            instr_status: Instruction.status,
        };
    }
);

instr = new Instruction({
    instr: 'null',
    }, function(args) {
       return { status: Instruction.status.OK };
    }
);
