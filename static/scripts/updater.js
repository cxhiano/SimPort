function Updater(url, handler) {
    this.url = url;
    this.handler = handler;
}

Updater.prototype = {
    errorSleepTime: 500,

    onSuccess: function(data) {
        data = eval('(' + data +')');
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
