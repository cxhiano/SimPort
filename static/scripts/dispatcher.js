function dispatcher(instr) {
    instr.forEach(function(item) {
        var i = JSON.parse(item);
        fb = Instruction.call(i);
        fb.token = i.token;
        instrUpdater.feedback(fb);
    });
}

instrUpdater = new Updater('instr/get', dispatcher);
