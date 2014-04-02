function Updater(url, handler) {
    this.url = url;
    this.handler = handler;
}

Updater.prototype = {
    errorSleepTime: 500,

    onSuccess: function(data) {
        console.log(this);
        data = eval('(' + data +')');
        for (var arg in data) {
            data[arg] = data[arg][0];
        }
        this.errorSleepTime = 500;
        window.setTimeout(this.poll.bind(this), 0);
        this.handler(data);
    },

    onError: function(response) {
        this.errorSleepTime *= 2;
        console.log(response);
        window.setTimeout(this.poll, this.errorSleepTime);
    },

    poll: function() {
        $.ajax({
            url: this.url,
            type: 'GET',
            dataType: 'text',
            success: this.onSuccess.bind(this),
            error: this.onError.bind(this),
        });
    }
};
