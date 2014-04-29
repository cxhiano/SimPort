var instr = new Instruction({
    instr: 'plannedQuest',
    operation: 'import', //or export
    boxes: ['A', 'B', 'C'],
    arriveIn: 10000,
    }, function(args) {
        args.side = 'l';
        var q = new Quest(args);
        setTimeout(q.activate.bind(q), args.arriveIn);
        return {
            status: Instruction.status.OK,
        };
    }
);

instr = new Instruction({
    instr: 'immediateQuest',
    operation: 'export',
    boxes: ['G'],
    }, function(args) {
        args.side = 'r';
        var q = new Quest(args);
        q.activate();
        return {
            status: Instruction.status.OK,
        };
    }
);

instr = new Instruction({
    instr: 'getPendingQuests',
    }, function(args) {
        var ret = [];
        for (var t in Quest.pendingQuests)
            ret.push(Quest.pendingQuests[t]);
        return {
            status: Instruction.status.OK,
            quests: ret,
        };
    }
);

instr = new Instruction({
    instr: 'getActivatedQuests',
    }, function(args) {
        var ret = [];
        for (var t in Quest.activatedQuests)
            ret.push(Quest.activatedQuests[t]);
        return {
            status: Instruction.status.OK,
            quests: ret,
        };
    }
);