var updater = {
    errorSleepTime: 500,

    url: 'instr/get',

    poll: function() {
        $.ajax({
            url: updater.url,
            type: 'GET',
            dataType: 'text',
            success: updater.onSuccess,
            error: updater.onError,
        });
    },

    onSuccess: function(data) {
        instr = eval('(' + data +')');
        $('#instructions').append(data);
        updater.errorSleepTime = 500;
        window.setTimeout(updater.poll, 0);
        updater.instrHandler(instr);
    },

    onError: function(response) {
        updater.errorSleepTime *= 2;
        console.log(response);
        window.setTimeout(updater.poll, updater.errorSleepTime);
    },

    instrHandler: function(instr) {
        for (var arg in instr) {
            instr[arg] = instr[arg][0];
        }

        var d = Depot.prototype.getInstance(instr['dr'], instr['dc']);

        switch(instr['instr']) {
            case 'move':
                if (instr['lift'] === 'l') {
                    d.lLift.moveTo(instr['to']);
                } else {
                    d.rLift.moveTo(instr['to']);
                }
                break;

            case 'set':
                d.updateBox(instr['br'], instr['bc'], instr['cnt']);
                break;

            case 'pickup':
                if (instr['lift'] === 'l') {
                    d.lLift.pickUp(instr['row']);
                } else {
                    d.rLift.pickUp(instr['row']);
                }
                break;

            case 'putdown':
                if (instr['lift'] === 'l') {
                    d.lLift.putDown(instr['row']);
                } else {
                    d.rLift.putDown(instr['row']);
                }
                break;
        }

    }
};
