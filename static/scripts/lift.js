function Lift(depot, args) {
    this.depot = depot;
    this.velocity = args.velocity;
    this.column = args.column;
    this.idle = true;
    this.hasBox = false;
    this.jobQueue = [];

    this.element = $('<div class="lift" />');
    var xy = this.getXY(this.column);
    this.element.css('left', xy.x + 'px');
    this.element.css('top', xy.y + 'px');
    this.updateSize();
    this.element.appendTo('#wrapper');
}

Lift.prototype = {
    updateSize: function() {
        this.element.css('width', view.box.width + view.depot.hSpace + 'px');
        this.element.css('height', view.depot.height + 'px');
    },

    getXY: function(column) {
        var xy = view.getXY({
            rowDepot: this.depot.row,
            columnDepot: this.depot.column,
            rowBox: 0,
            columnBox: column,
        });

        return {
            x: xy.x - view.depot.hSpace / 2,
            y: xy.y - view.depot.vSpace,
        };
    },

    addJob: function(job) {
        console.log(job);
        if (this.idle) {
            this.idle = false;
            job();
        } else {
            this.jobQueue.push(job);
        }
        console.log(this.jobQueue);
    },

    scheduleJobs: function() {
        if (this.idle && this.jobQueue.length > 0) {
            this.idle = false;
            console.log(this.jobQueue);
            var job = this.jobQueue[0];
            this.jobQueue = this.jobQueue.slice(1);
            job();
        }
    },

    moveTo: function(column) {
        var from = this.getXY(this.column).x,
            to = this.getXY(column).x,
            t = 1000 * Math.abs(from - to) / this.velocity,
            ths = this;

        this.moving = true;
        this.element.animate({
                left: to
            }, {
                duration: t,
                easing: 'linear',
                complete: function() {
                    ths.column = column;
                    ths.idle = true;
                    ths.scheduleJobs();
                }
            });
    },

    pickUp: function(row) {
        if (!this.moving) {
            var cnt = this.depot.getBoxCount(row, this.column);
            if (cnt > 0) {
                this.depot.updateBox(row, this.column, cnt - 1);
                this.hasBox = true;
            }
        }
        this.idle = true;
        this.scheduleJobs();
    },

    putDown: function(row) {
        var cnt = this.depot.getBoxCount(row, this.column);
        if (this.hasBox) {
            this.depot.updateBox(row, this.column, cnt + 1);
            this.hasBox = false;
        }
        this.idle = true;
        this.scheduleJobs();
    }
};
