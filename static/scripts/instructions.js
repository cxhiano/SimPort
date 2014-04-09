instrHandler = function(instr) {
    var d = Depot.prototype.getInstance(instr['dr'], instr['dc']),
        lift = null;

    if (instr['lift'] === 'l') {
        lift = d.lLift;
    } else {
        lift = d.rLift;
    }

    var job = lift[instr['instr']];
    lift.addJob(job.work.bind(lift, instr));
};

instrUpdater = new Updater('instr/get', instrHandler);
