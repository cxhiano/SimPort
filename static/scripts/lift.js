function Lift(depot, args) {
    this.depot = depot;
    this.velocity = args.velocity;
    this.view = document.createElement('div');
    var v = this.view;
    v.className = 'lift';
    v.style.width = view.box.width + view.depot.hSpace + 'px';
    v.style.height = view.depot.height + 'px';
    v.style.left = args.xy.x - view.depot.hSpace / 2 + 'px';
    v.style.top = args.xy.y - view.depot.vSpace + 'px';
    document.getElementById('wrapper').appendChild(v);
}

Lift.prototype = {
};
