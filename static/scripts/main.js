function initContext() {
    fullScreen = function(obj) {
        obj.width = window.innerWidth;
        obj.height = window.innerHeight;
    }

    wrapper = document.getElementById('canvas');
    canvas = document.getElementById('canvas');
    data = document.getElementById('data');

    ctx = canvas.getContext('2d');
    fullScreen(canvas);
}

function generateData(dim, max) {
    if (dim.length == 0) {
        return parseInt(Math.random() * (max + 1));
    }

    var ret = [];
    for (var i = 0; i < dim[0]; ++i) {
        ret.push(generateData(dim.slice(1), max));
    }

    return ret;
}

function registerEvents() {
    $('#set').click(function() {
        var args = {};
        $('#config input').each(function() {
            args[this.id] = parseInt(this.value);
        });

        view.config(args);
        var data = generateData([args.rows, args.columns, args.depotRows, args.depotColumns], args.maxStacks);
        view.display(data);
    });
}

function initNavigator() {
    layout = ['#config', '#wrapper', '#data'];
    current_wnd = 0;
    for (var i = 1; i < layout.length; ++i) {
        $(layout[i]).hide();
    }

    $(document).keydown(function(e) {
        if (e.which == 37) {        //left arrow pressed
            if (current_wnd > 0) {
                $(layout[current_wnd]).hide();
                --current_wnd;
                $(layout[current_wnd]).slideToggle();
            }
        }

        if (e.which == 39) {        //right arrow pressed
            if (current_wnd + 1 < layout.length) {
                $(layout[current_wnd]).hide();
                ++current_wnd;
                $(layout[current_wnd]).slideToggle();
            }
        }
    });
}

$(document).ready(function() {
    initContext();
    view.init_units();
    view.canvas.setSize(canvas.width, canvas.height);
    registerEvents();
    initNavigator();
    $('#set').click();
    updater.poll();
});
