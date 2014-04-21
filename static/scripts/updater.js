function Updater(url, handler) {
    this.url = url;
    this.handler = handler;
    this.fb_flush = function() {
        if (this.fb_data.length > 0) {
            console.log(this.fb_data);
            this.request.abort();
        }
        setTimeout(this.fb_flush.bind(this), 1000);
    };
    setTimeout(this.fb_flush.bind(this), 1000);
}

Updater.prototype = {
    errorSleepTime: 500,

    fb_data: [],

    feedback: function(data) {
        this.fb_data.push(data);
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
        console.log('poll');
        this.request = $.ajax({
            url: this.url,
            type: 'POST',
            data: JSON.stringify(this.fb_data),
            dataType: 'json',
            context: this,
            success: this.onSuccess,
            error: this.onError,
        });
        this.fb_data = [];
    }
};
