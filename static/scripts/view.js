view = {
    display: function(data) {
        this.canvas.data = data;
        this.imgData = ctx.createImageData(canvas.width, canvas.height);
        this.canvas.setImgData(this.imgData);
        this.canvas.cascadeDraw(0, 0);
        ctx.putImageData(this.imgData, 0, 0);
    },

    init_units: function() {
        this.box = new CascadeView(null);
        this.box.draw = function(x0, y0) {
            var color = view.getColor(this.data);
            for (var x = 0; x < this.width; ++x)
                for (var y = 0; y < this.height; ++ y) {
                    var p = 4 * ((y + y0) * this.imgData.width + x + x0);
                    this.imgData.data[p] = color.R;
                    this.imgData.data[p + 1] = color.G;
                    this.imgData.data[p + 2] = color.B;
                    this.imgData.data[p + 3] = color.A;
                }
        };

        this.depot = new CascadeView(this.box);
        this.depot.hMargin = this.depot.vMargin = 0.2;

        this.canvas = new CascadeView(this.depot);
        this.canvas.hMargin = this.canvas.vMargin = 0.2;
    },

    config: function(args) {
        this.depot.rows = args.depotRows;
        this.depot.columns = args.depotColumns;
        this.canvas.rows = args.rows;
        this.canvas.columns = args.columns;
        this.maxStacks = args.maxStacks;
        this.canvas.updateLayout();
    },

    getXY: function(pos) {
        var xy = this.canvas.getXY(pos.rowDepot, pos.columnDepot),
            d_xy = this.depot.getXY(pos.rowBox, pos.columnBox);
        return {
            x: xy.x + d_xy.x,
            y: xy.y + d_xy.y,
        };
    },

    getColor: function(data) {
        var tmp = 255 - data / this.maxStacks * 255;
        return {
            R: 255,
            G: tmp,
            B: tmp,
            A: 255,
        };
    },
};
