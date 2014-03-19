function init_context() {
    canvas = document.getElementById('canvas');
    wrapper = document.getElementById('wrapper');
    ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    wrapper.height = window.innerHeight;
    wrapper.width = window.innerWidth;
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
console.log(data);

views.init_units();
views.config(args);
views.canvas.data = data;

imgData = ctx.createImageData(canvas.width, canvas.height);
views.canvas.cascadeDraw(imgData, 0, 0);
ctx.putImageData(imgData, 0, 0);
