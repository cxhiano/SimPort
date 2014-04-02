instrHandler = function(instr) {
    var d = Depot.prototype.getInstance(instr['dr'], instr['dc']),
        lift = null;

    if (instr['lift'] === 'l') {
        lift = d.lLift;
    } else {
        lift = d.rLift;
    }

    var job;
    switch(instr['instr']) {
        case 'move':
            job = lift.moveTo.bind(lift, instr['column']);
            break;

        case 'pickup':
            job = lift.pickUp.bind(lift, instr['row']);
            break;

        case 'putdown':
            job = lift.putDown.bind(lift, instr['row']);
            break;
    }
    lift.addJob(job);
};

instrUpdater = new Updater('instr/get', instrHandler);
