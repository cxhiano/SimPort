function Instruction(example, process) {
    this.example = example;
    this.process = process;
    Instruction.register(this);
}

Instruction.instrList = [];

Instruction.register = function(instr) {
    Instruction.instrList.push(instr);
};

Instruction.retrieve = function(name) {
    var lst = Instruction.instrList;
    for (var id in lst) {
        if (lst[id].example.instr === name) {
            return lst[id];
        }
    }
};

Instruction.call = function(args) {
    var instr = Instruction.retrieve(args.instr);
    instr.call(args);
};

Instruction.prototype = {
    setContextGetter: function(ctxGetter) {
        this.ctxGetter = ctxGetter;
    },

    setPreCondition: function(preCond) {
        this.preCond = preCond;
    },

    call: function(args) {
        var ctx = this;
        if (this.ctxGetter) {
            ctx = this.ctxGetter(args);
        }
        if (this.preCond === undefined || this.preCond.call(ctx, args)) {
            fb = {
                'status': 'success',
                'token': args.token,
                'result': this.process.call(ctx, args),
            };
            instrUpdater.feedback(fb);
        } else {
            instrUpdater.feedback({
                'status': 'invalid',
                'token': args.token,
            });
        }
    }
};

var instr = new Instruction(
    {
        instr: 'getInstructionExample',
        name: 'takeBox',
    },

    function(args) {
        var instr = Instruction.retrieve(args.name);
        if (instr) {
            return instr.example;
        } else {
            return 'No such instruction';
        }
    }
);
