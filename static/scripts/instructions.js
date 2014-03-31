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
        console.log(instr);
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
        console.log(instr);
        if (instr['lift'] === 'l') {
            d.lLift.moveTo(instr['pos']);
        } else {
            d.rLift.moveTo(instr['pos']);
        }
    }
};
