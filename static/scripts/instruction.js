function Instruction(example, process) {
    this.example = example;
    this.process = process;
    Instruction.register(this);
}

Instruction.status = {
    OK: 0,
    RETURN_AT_RUNTIME: 1,
    ERR_PRECOND: 2,
    INVALID_ARGS: 3,
    NO_SUCH_INSTRUCTION: 4,
    RUNTIME_ERROR: 5,
    GET_CONTEXT_ERROR: 6,
};

Instruction.instrs = {};

Instruction.register = function(instr) {
    Instruction.instrs[instr.example.instr] = instr;
};

Instruction.call = function(args) {
    var instr = Instruction.instrs[args.instr];
    if (instr) {
        return instr._call(args);
    }
    return {
        status: Instruction.status.NO_SUCH_INSTRUCTION,
    };
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

    _call: function(args) {
        if (this.invalidArgs(args)) {
            return {
                status: Instruction.status.INVALID_ARGS,
            };
        }

        var ctx = this;
        if (this.ctxGetter) {
            try {
                ctx = this.ctxGetter(args);
            } catch (err) {
                return {
                    status: Instruction.status.GET_CONTEXT_ERROR,
                    error: err.message,
                };
            }
        }
        if (this.preCond === undefined || this.preCond.call(ctx, args)) {
            try {
                return this.process.call(ctx, args);
            } catch (err) {
                return {
                    status: Instruction.status.RUNTIME_ERROR,
                    error: err.message,
                };
            }
        } else {
            return {
                status: Instruction.status.ERR_PRECOND,
            };
        }
    }
};
