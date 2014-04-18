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
    var instr = Instruction.instrs[args.instr];
    if (instr) {
        return instr.call(args);
    }
    return {
        status: 3,  //no such method
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

    call: function(args) {
        if (this.invalidArgs(args)) {
            return {
                status: 2,  //invalid arguments
            };
        }

        var ctx = this;
        if (this.ctxGetter) {
            try {
                ctx = this.ctxGetter(args);
            } catch (err) {
                console.log(err);
                return {
                    status: 2,
                };
            }
        }
        if (this.preCond === undefined || this.preCond.call(ctx, args)) {
            return {
                status: 0,  //ok
                result: this.process.call(ctx, args),
            };
        } else {
            return {
                status: 1,  //pre condition not satisfied
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