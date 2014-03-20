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

                    {
                        R: 255,
                        G: 255 - this.data * 40,
                        B: 255 - this.data * 40,
                        A: 255,
                    }
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
        this.canvas.updateLayout();
    },

    getPos: function(row, column, depotRow, depotColumn) {
        var pos = this.canvas.getPos(row, column),
            d_pos = this.depot.getPos(depotRow, depotColumn);
        return {
            x: pos.x + d_pos.x,
            y: pos.y + d_pos.y,
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
