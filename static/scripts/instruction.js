function Instruction(example, process) {
    this.example = example;
    this.process = process;
    Instruction.register(this);
}

Instruction.instrs = {};

Instruction.register = function(instr) {
    Instruction.instrs[instr.example.instr] = instr;
};

Instruction.call = function(args) {
    return Instruction.instrs[args.instr].call(args);
};

Instruction.prototype = {
    setContextGetter: function(ctxGetter) {
        this.ctxGetter = ctxGetter;
    },

    setPreCondition: function(preCond) {
        this.preCond = preCond;
    },

    invalidArgs: function(args) {
        for (var arg in this.example) {
            if (!(arg in args) || typeof(this.example[arg]) != typeof(args[arg])) {
                return true;
            }
        }
        return false;
    },

    call: function(args) {
        if (this.invalidArgs(args)) {
            return {
                status: 2,
            };
        }

        var ctx = this;
        if (this.ctxGetter) {
            ctx = this.ctxGetter(args);
        }
        if (this.preCond === undefined || this.preCond.call(ctx, args)) {
            return {
                status: 0,
                result: this.process.call(ctx, args),
            };
        } else {
            return {
                status: 1,
            };
        }
    }
};

var instr = new Instruction(
    {
        instr: 'getExample',
        name: 'pickUp',
    },

    function(args) {
        var instr = Instruction.instrs[args.name];
        if (instr) {
            return instr.example;
        } else {
            return 'No such instruction';
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
        return ret;
    }
);