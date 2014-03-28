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
        console.log(data);
        $('#instructions').append(data);
        updater.errorSleepTime = 500;
        window.setTimeout(updater.poll, 0);
    },

    onError: function(response) {
        updater.errorSleepTime *= 2;
        console.log(response);
        window.setTimeout(updater.poll, updater.errorSleepTime);
    },
};
