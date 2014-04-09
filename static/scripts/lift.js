function DivComponent(master, width, height) {
    this.master = master;
    this.element = $('<div class="lift" />');
    this.width = width;
    this.height = height;
}

DivComponent.prototype = {
    display: function(view) {
        var xy = this.getXY(this.pos);
        view.left = xy.x + 'px';
        view.top = xy.y + 'px';
        view.width = this.width + 'px';
        view.height = this.height + 'px';

        for (var v in view) {
            this.element.css(v, view[v]);
        }
        this.element.appendTo('#wrapper');
    },

    getMoveTime: function(to, velocity) {
        var from = this.getXY(this.pos),
            t_fun = function(from, to, velocity) {
                return 1000 * Math.abs(from - to) / velocity;
            };

        if (from.x === to.x) {
            return t_fun(from.y, to.y, velocity);
        } else {
            return t_fun(from.x, to.x, velocity);
        }
    },

    move: function(pos, velocity) {
        var to = this.getXY(pos),
            t = this.getMoveTime(to, velocity);

        var onComplete = function() {
            this.pos = pos;
            this.master.idle = true;
            this.master.scheduleJobs();
        };

        this.element.animate({
                left: to.x,
                top: to.y,
            }, {
                duration: t,
                easing: 'linear',
                complete: onComplete.bind(this),
            });
    },
};

function Lift(depot, row, column) {
    this.depot = depot;
    this.idle = true;
    this.carry = -1;
    this.jobQueue = [];

    this.arm = new DivComponent(this, view.box.width, view.depot.height);
    this.arm.pos = column;
    this.arm.getXY = function(pos) {
        var xy = this.master.getXY(0, pos);
        xy.y -= view.depot.vSpace;
        return xy;
    };
    this.arm.display({});

    this.lift = new DivComponent(this, view.box.width + view.depot.hSpace, view.box.height);
    this.lift.pos = row;
    this.lift.getXY = function() {
        var row = arguments[0],
            column = arguments[1] || this.master.arm.pos,
            xy = this.master.getXY(row, column);
        xy.x -= view.depot.hSpace / 2;
        return xy;
    };
    this.lift.display({
        'border-style': 'solid',
        'border-width': '1px',
    });
}

Lift.prototype = {
    getXY: function(row, column) {
        return view.getXY({
            rowDepot: this.depot.row,
            columnDepot: this.depot.column,
            rowBox: row,
            columnBox: column,
            });
    },

    addJob: function(job) {
        this.jobQueue.push(job);
        this.scheduleJobs();
    },

    scheduleJobs: function() {
        if (this.idle && this.jobQueue.length > 0) {
            this.idle = false;
            var job = this.jobQueue[0];
            this.jobQueue = this.jobQueue.slice(1);
            job();
        }
    },
hmove: {
        params: {
            velocity: 20,
        },

        work: function(args) {
            var v = this.hmove.params.velocity,
                to = this.lift.getXY(this.lift.pos, args.column),
                t = this.lift.getMoveTime(to, v);
                this.lift.element.animate({
                        left: to.x,
                        top: to.y,
                    }, {
                        duration: t,
                        easing: 'linear',
                    });

            this.arm.move(args.column, v);
        },
    },

    vmove: {
        params: {
            velocity: 20,
        },

        work: function(args) {
            this.lift.move(args.row, this.vmove.params.velocity);
        },
    },

    pickUp: function() {
        var cnt = this.depot.getBoxCount(row, this.column);
        if (cnt > 0 && this.carry === -1) {
            this.depot.updateBox(row, this.column, cnt - 1);
            this.carry = 1;
        }
        this.idle = true;
        this.scheduleJobs();
    },

    putDown: function() {
        var cnt = this.depot.getBoxCount(row, this.column);
        if (this.carry != -1) {
            this.depot.updateBox(row, this.column, cnt + 1);
            this.carry = -1;
        }
        this.idle = true;
        this.scheduleJobs();
    }
};
