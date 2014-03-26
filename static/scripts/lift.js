function Lift(depot, args) {
    this.depot = depot;
    this.velocity = args.velocity;
    this.pos = args.pos;
    var v = document.createElement('div');
    v.id = args.id;
    v.className = 'lift';
    var xy = this.getXY(this.pos);
    v.style.left = xy.x + 'px';
    v.style.top = xy.y + 'px';
    document.getElementById('wrapper').appendChild(v);
    this.element = $('#' + v.id);
    this.updateSize();
}

Lift.prototype = {
    updateSize: function() {
        this.element.width(view.box.width + view.depot.hSpace + 'px');
        this.element.height(view.depot.height + 'px');
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
        var xy = this.getXY(pos);
        this.element.animate({left: xy.x}, 5000, function() {
        });
    }
};
