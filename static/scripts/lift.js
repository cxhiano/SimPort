function Lift(depot, args) {
    this.depot = depot;
    this.velocity = args.velocity;
    this.pos = args.pos;
    this.element = $('<div class="lift" />');
    var xy = this.getXY(this.pos);
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

    getXY: function(pos) {
        var xy = view.getXY({
            rowDepot: this.depot.row,
            columnDepot: this.depot.column,
            rowBox: 0,
            columnBox: pos,
        });

        return {
            x: xy.x - view.depot.hSpace / 2,
            y: xy.y - view.depot.vSpace,
        };
    },

    moveTo: function(pos) {
        var from = this.getXY(this.pos).x,
            to = this.getXY(pos).x,
            t = 1000 * Math.abs(from - to) / this.velocity,
            ths = this;

        this.element.animate({
                left: to
            }, {
                duration: t,
                easing: 'linear',
                complete: function() {
                    ths.pos = pos;
                }
            });
    }
};
