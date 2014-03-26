view = {
    display: function(data) {
        this.canvas.data = data;
        this.imgData = ctx.createImageData(canvas.width, canvas.height); 
        this.canvas.cascadeDraw(this.imgData, 0, 0);
        ctx.putImageData(this.imgData, 0, 0);
    },

    init_units: function() {
        this.box = new CascadeView(null);
        this.box.draw = function(imgData, x0, y0) {
            view.drawRect(
                    imgData,

                    {
                        x0: x0,
                        y0: y0,
                        width: this.width,
                        height: this.height,
                    },

                    view.getColor(this.data)
                );
        }

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

    drawRect: function(imgData, rect, color) {
        for (var x = 0; x < rect.width; ++x)
            for (var y = 0; y < rect.height; ++ y) {
                var p = 4 * ((y + rect.y0) * imgData.width + x + rect.x0);
                imgData.data[p] = color.R;
                imgData.data[p + 1] = color.G;
                imgData.data[p + 2] = color.B;
                imgData.data[p + 3] = color.A;
            }
    },
};
