function randomValue(max) {
    return parseInt(Math.random() * (max + 1));
}

function generateData(dim, max) {
    if (dim.length == 0) {
        return randomValue(max);
    }

    var ret = [];
    for (var i = 0; i < dim[0]; ++i) {
        ret.push(generateData(dim.slice(1), max));
    }

    return ret;
}
