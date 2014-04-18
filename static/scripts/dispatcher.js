function dispatcher(instr) {
    instr.forEach(function(item) {
        console.log(item);
        Instruction.call(JSON.parse(item));
    });
}

instrUpdater = new Updater('instr/get', dispatcher);
