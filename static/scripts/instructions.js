function dispatcher(instr) {
    [Lift, Depot].forEach(function(item) {
        console.log(item);
        if (instr['instr'] in item.prototype) {
            item.instrHandler(instr);
        }
    });
}

instrUpdater = new Updater('instr/get', dispatcher);
