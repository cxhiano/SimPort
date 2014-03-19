views = {
    init_units: function() {
        box = new CascadeView(null);
        box.draw = function(imgData, x0, y0) {
            for (var x = 0; x < this.width; ++x)
                for (var y = 0; y < this.height; ++ y) {
                    var p = 4 * ((y + y0) * imgData.width + x + x0);
                    imgData.data[p] = 0;
                    imgData.data[p + 1] = 0;
                    imgData.data[p + 2] = 0;
                    imgData.data[p + 3] = 255;
                }
        }

        depot = new CascadeView(box);
        depot.hMargin = depot.vMargin = 0.2;

        g = new CascadeView(depot);
        g.hMargin = g.vMargin = 0.4;
    },

    config: function() {
        depot.rows = 5;
        depot.columns = 30;
        g.rows = 5;
        g.columns = 5;
        g.setSize(canvas.width, canvas.height);

    }
}
