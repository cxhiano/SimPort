function dispatcher(instr) {
    instr.forEach(function(item) {
        var i = JSON.parse(item);
        if (i.instr != 'null') {
            fb = Instruction.call(i);
            if (fb.status != Instruction.status.RETURN_AT_RUNTIME) {
                fb.token = i.token;
                instrUpdater.feedback(fb);
            }
        }
    });
}

instrUpdater = new Updater('instr/get', dispatcher);
