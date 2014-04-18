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

function Lift(depot, row, column) {
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

    this.lift = new DivComponent(this, port.box.width + port.depot.hSpace, port.box.height);
    this.lift.pos = row;
    this.lift.getXY = function() {
        var row = arguments[0],
        column = (arguments[1] === undefined)?this.master.arm.pos:arguments[1],
            xy = this.master.getXY(row, column);
        xy.x -= port.depot.hSpace / 2;
        return xy;
    };
    this.lift.display({});
}

Lift.params = {
    hVelocity: 20,
    vVelocity: 20,
    tPickup: 1000,
    tPutdown: 1000,
};

Lift.instrHandler = function(instr) {
    var job = lift[instr.instr];
    lift.addJob(job.work.bind(lift, instr));
};

Lift.registerInstructions = function() {
    var getLift = function(instr) {
        var d = Depot.getInstance(instr.dr, instr.dc);
        if (instr.lift === 'l') {
            return d.lLift;
        } else if (instr.lift === 'r') {
            return d.rLift;
        }
        throw 'can not find lift' + JSON.stringify(instr);
    };

    var instr = new Instruction(
        {
            instr: 'hMove',
            dr: 0,
            dc: 0,
            lift: 'l',
            column: 4,
        }, 

        function(args) {
            this.addJob(this.hMove.bind(this, args.column));
        }
    );
    instr.setContextGetter(getLift);
    instr.setPreCondition(function(args) {
        return args.column >= 0 && args.column < port.depot.columns;
    });

    instr = new Instruction(
        {
            instr: 'vMove',
            dr: 0,
            dc: 0,
            lift: 'r',
            row: 3,
        },

        function(args) {
            this.addJob(this.vMove.bind(this, args.row));
        }
    );
    instr.setContextGetter(getLift);
    instr.setPreCondition(function(args) {
        return args.row >= 0 && args.row < port.depot.rows;
    });

    instr = new Instruction(
        {
            instr: 'pickup',
            dr: 0,
            dc: 0,
            lift: 'l',
        },

        function(args) {
            this.addJob(this.pickUp.bind(this)); 
        } 
    );
    instr.setContextGetter(getLift);

    instr = new Instruction(
        {
            instr: 'putdown',
            dr: 0,
            dc: 0,
            lift: 'r',
        },

        function(args) {
            this.addJob(this.putDown.bind(this));
        }
    );
    instr.setContextGetter(getLift);

    instr = new Instruction(
        {
            instr: 'getPosition',
            dr: 0,
            dc: 0,
            lift: 'l',
        },

        function(args) {
            return {
                row: this.lift.pos,
                column: this.arm.pos,
            };
        }
    );
    instr.setContextGetter(getLift);
};

Lift.prototype = {
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
            job();
        }
    },

    hMove: function(column) {
        if ((this === this.depot.lLift && column >= this.depot.rLift.arm.pos) ||
            (this === this.depot.rLift && column <= this.depot.lLift.arm.pos)) {
            console.log(this.depot);
            this.idle = true;
            this.scheduleJobs();
            return false;
        }
        var v = Lift.params.hVelocity,
            to = this.lift.getXY(this.lift.pos, column),
            t = this.lift.getMoveTime(to, v);

        this.lift.element.animate(
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
        this.lift.move(row, Lift.params.vVelocity);
    },

    pickUp: function() {
        if (this.carry != -1 || this.depot.getBoxCount(this.lift.pos, this.arm.pos) === 0) {
            this.idle = true;
            this.scheduleJobs();
            return false;
        }
        var fun = function() {
            this.carry = this.depot.takeBox(this.lift.pos, this.arm.pos);
            this.idle = true;
            this.scheduleJobs();
        };

        this.lift.element.animate({
                opacity: 1,
            }, {
                duration: Lift.params.tPickup,
                complete: fun.bind(this),
            });
    },

    putDown: function() {
        if (this.carry === -1 || this.depot.getBoxCount(this.lift.pos, this.arm.pos) === post.maxStacks) {
            this.idle = true;
            this.scheduleJobs();
            return false;
        }
        var fun = function() {
            this.depot.addBox(this.lift.pos, this.arm.pos, this.carry);
            this.carry = -1;

            this.idle = true;
            this.scheduleJobs();
        };

        this.lift.element.animate(
            {
                opacity: 0.3,
            }, {
                duration: Lift.params.tPutdown,
                complete: fun.bind(this),
            });
    },
};