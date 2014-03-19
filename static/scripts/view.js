views = {
    init_units: function() {
        this.box = new CascadeView(null);
        this.box.draw = function(imgData, x0, y0) {
            for (var x = 0; x < this.width; ++x)
                for (var y = 0; y < this.height; ++ y) {
                    var p = 4 * ((y + y0) * imgData.width + x + x0);
                    imgData.data[p] = 0;
                    imgData.data[p + 1] = 0;
                    imgData.data[p + 2] = 0;
                    imgData.data[p + 3] = 255;
                }
        }

        this.depot = new CascadeView(this.box);
        this.depot.hMargin = this.depot.vMargin = 0.2;

        this.canvas = new CascadeView(this.depot);
        this.canvas.hMargin = this.canvas.vMargin = 0.2;
    },

    config: function() {
        this.depot.rows = 25;
        this.depot.columns = 30;
        this.canvas.rows = 5;
        this.canvas.columns = 5;
        this.canvas.setSize(canvas.width, canvas.height);
    }
}
