function Updater(url, handler) {
    this.url = url;
    this.handler = handler;
    this.fbFlush = function() {
        var d = new Date();
        if (d - this.lastPoll > this.maxIdleTime && this.fbData.length > 0) {
            this.request.abort();
        }
        setTimeout(this.fbFlush.bind(this), 1000);
    };
    setTimeout(this.fbFlush.bind(this), 1000);
}

Updater.prototype = {
    errorSleepTime: 500,

    fbData: [],

    lastPoll: 0,

    maxIdleTime: 800,

    feedback: function(data) {
        this.fbData.push(data);
    },

    onSuccess: function(data) {
        this.errorSleepTime = 500;
        window.setTimeout(this.poll.bind(this), 0);
        this.handler(data);
    },

    onError: function(jqXHR, textStatus, errorThrown) {
        if (textStatus != 'abort') {
            console.log(textStatus);
            console.log(errorThrown);
            this.errorSleepTime *= 2;
            setTimeout(this.poll.bind(this), this.errorSleepTime);
        } else {
            this.poll();
        }
    },

    poll: function() {
        this.lastPoll = new Date();
        this.request = $.ajax({
            url: this.url,
            type: 'POST',
            data: JSON.stringify(this.fbData),
            dataType: 'json',
            context: this,
            success: this.onSuccess,
            error: this.onError,
        });
        this.fbData = [];
    }
};
