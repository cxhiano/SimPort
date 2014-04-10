function CascadeView(sub) {
    this.sub = sub;
}

CascadeView.prototype = {
    setSize: function(width, height) {
        this.width = width;
        this.height = height;

        if (this.sub) {
            this.updateLayout();
        }
    },

    setImgData: function(imgData) {
        this.imgData = imgData;
        if (this.sub) {
            this.sub.setImgData(imgData);
        }
    },

    render: function() {
        ctx.putImageData(this.imgData, 0, 0, this.x0, this.y0, this.width, this.height);
    },

    updateLayout: function() {
        this.hSpace = parseInt(this.width * this.hMargin / (this.columns + 1));
        if (this.hSpace < 1) {
            this.hSPace = 1;
        }
        this.vSpace = parseInt(this.height * this.vMargin / (this.rows + 1));
        if (this.vSpace < 1) {
            this.vSpace = 1;
        }
        this.subWidth = parseInt((this.width - this.hSpace * (1 + this.columns)) / this.columns);
        this.subHeight = parseInt((this.height - this.vSpace * (1 + this.rows)) / this.rows);

        this.sub.setSize(this.subWidth, this.subHeight);
    },

    getXY: function(r, c) {
        return {
            x: this.hSpace + c * (this.subWidth + this.hSpace),
            y: this.vSpace + r * (this.subHeight + this.vSpace),
        };
    },

    cascadeDraw: function(x0, y0) {
        this.x0 = x0;
        this.y0 = y0;
        if (this.draw) {
            this.draw(x0, y0);
        }

        if (this.sub) {
            for (var r = 0; r < this.rows; ++r)
                for (var c = 0; c < this.columns; ++c) {
                    this.sub.data = this.data[r][c];
                    var xy = this.getXY(r, c);
                    this.sub.cascadeDraw(x0 + xy.x, y0 + xy.y);
                }
        }
    }
};

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
            var color = view.getColor(this.data.length);
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
