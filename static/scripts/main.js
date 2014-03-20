function initContext() {
    fullScreen = function(obj) {
        obj.width = window.innerWidth;
        obj.height = window.innerHeight;
    }

    wrapper = document.getElementById('canvas');
    canvas = document.getElementById('canvas');

    ctx = canvas.getContext('2d');
    fullScreen(canvas);
}

function registerEvents() {
    $('#set').click(function() {
        var args = {};
        $('#config > input').each(function() {
            args[this.id] = parseInt(this.value);
        });

        console.log(args);
        view.config(args);
        console.log(view);
        var data = generateData([args.rows, args.columns, args.depotRows, args.depotColumns], args.maxStacks);
        view.display(data);
    });

    toggleWindows = function() {
        $('#config').slideToggle();
        $('#canvas').slideToggle();
    }

    $('#view').click(toggleWindows);
}

$(document).ready(function() {
    initContext();
    view.init_units();
    view.canvas.setSize(canvas.width, canvas.height);
    registerEvents();
    $('#canvas').hide();
    console.log(view);
});
