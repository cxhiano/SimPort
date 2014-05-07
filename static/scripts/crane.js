function DivComponent(master, width, height) {
    this.master = master;
    this.element = $('<div class="crane" />');
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
            this.master.idle = true;
            this.master.scheduleJobs();
        };

        this.pos = pos;
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

function Crane(depot, row, column) {
    this.depot = depot;
    this.idle = true;
    this.carry = -1;
    this.jobQueue = [];

    this.arm = new DivComponent(this, port.box.width, port.depot.height);
    this.arm.pos = column;
    this.arm.getXY = function(pos) {
        var xy = this.master.getXY(0, pos);
        xy.y -= port.depot.vSpace;
        return xy;
    };
    this.arm.display({});

    this.crane = new DivComponent(this, port.box.width + port.depot.hSpace, port.box.height);
    this.crane.pos = row;
    this.crane.getXY = function() {
        var row = arguments[0],
            column = (arguments[1] === undefined)?this.master.arm.pos:arguments[1],
            xy = this.master.getXY(row, column);
        xy.x -= port.depot.hSpace / 2;
        return xy;
    };
    this.crane.display({});
}

Crane.params = {
    hVelocity: 200,
    vVelocity: 200,
    tPickup: 100,
    tPutdown: 100,
//    tV: (port.box.height + port.deopt.vSpace) / Crane.params.vVelocity,
//    tH: (port.box.width + port.deopt.hSpace) / Crane.params.hVelocity,
};

Crane.prototype = {
    getXY: function(row, column) {
        return port.getXY({
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
            try {
                var chks = job.runTimeCheckers;
                for (var err in chks) {
                    if (chks[err].call(this, job.args)) {
                        this.idle = true;
                        this.scheduleJobs();
                        throw new Error(err);
                    }
                }
                job.run();
            } catch (error) {
                instrUpdater.feedback({
                    status: Instruction.status.RUNTIME_ERROR,
                    token: job.args.token,
                    error: error.message,
                });
            }
            instrUpdater.feedback({
                status: Instruction.status.OK,
                token: job.args.token,
            });
        }
    },

    hMove: function(column) {
        var v = Crane.params.hVelocity,
            to = this.crane.getXY(this.crane.pos, column),
            t = this.crane.getMoveTime(to, v);

        this.crane.element.animate(
            {
                left: to.x,
                top: to.y,
            }, {
                duration: t,
                easing: 'linear',
            });

        this.arm.move(column, v);
    },

    vMove: function(row) {
        this.crane.move(row, Crane.params.vVelocity);
    },

    pickUp: function() {
        var fun = function() {
            this.carry = this.depot.takeBox(this.crane.pos, this.arm.pos);
            this.idle = true;
            this.scheduleJobs();
        };

        this.crane.element.animate({
                opacity: 1,
            }, {
                duration: Crane.params.tPickup,
                complete: fun.bind(this),
            });
    },

    putDown: function() {
        var fun = function() {
            this.depot.addBox(this.crane.pos, this.arm.pos, this.carry);
            this.carry = -1;

            this.idle = true;
            this.scheduleJobs();
        };

        this.crane.element.animate(
            {
                opacity: 0.3,
            }, {
                duration: Crane.params.tPutdown,
                complete: fun.bind(this),
            });
    },
};