function Updater(url, handler) {
    this.url = url;
    this.handler = handler;
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
        this.errorSleepTime *= 2;
        console.log(textStatus);
        console.log(errorThrown);
        window.setTimeout(this.poll.bind(this), this.errorSleepTime);
    },

    poll: function() {
        $.ajax({
            url: this.url,
            type: 'POST',
            data: JSON.stringify(this.fb_data),
            dataType: 'json',
            context: this,
            success: this.onSuccess,
            error: this.onError,
        });
    }
};
