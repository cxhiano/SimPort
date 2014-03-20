function init_context() {
    fullScreen = function(obj) {
        obj.width = window.innerWidth;
        obj.height = window.innerHeight;
    }

    wrapper = document.getElementById('canvas');
    canvas = document.getElementById('canvas');
    config = document.getElementById('config');

    ctx = canvas.getContext('2d');
    fullScreen(canvas);
    fullScreen(wrapper);
    $('#canvas').hide();
}

function getValue() {
    return parseInt(Math.random() * (args.maxStack + 1));
}

function generateData(dim, getValue) {
    if (dim.length == 0) {
        return getValue();
    }

    var ret = [];
    for (var i = 0; i < dim[0]; ++i) {
        ret.push(generateData(dim.slice(1), getValue));
    }
    return ret;
}

$(document).ready(function() {
    init_context();

    args = {
        depotRows: 5,
        depotColumns: 5,
        rows: 5,
        columns: 5,
        width: canvas.width,
        height: canvas.height,
        maxStack: 6,
    };

    data = generateData([args.rows, args.columns, args.depotRows, args.depotColumns], getValue);

    view.init_units();
    view.config(args);
    view.display(data);
});
