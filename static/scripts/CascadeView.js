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

    getPos: function(r, c) {
        return {
            x: this.hSpace + c * (this.subWidth + this.hSpace),
            y: this.vSpace + r * (this.subHeight + this.vSpace),
        };
    },

    cascadeDraw: function(imgData, x0, y0) {
        if (this.draw) {
            this.draw(imgData, x0, y0);
        }

        if (this.sub) {
            for (var r = 0; r < this.rows; ++r)
                for (var c = 0; c < this.columns; ++c) {
                    this.sub.data = this.data[r][c];
                    var pos = this.getPos(r, c);
                    this.sub.cascadeDraw(imgData, x0 + pos.x, y0 + pos.y);
                }
        }
    }
};
