function init_context() {
    canvas = document.getElementById('canvas');
    wrapper = document.getElementById('wrapper');
    ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    wrapper.height = window.innerHeight;
    wrapper.width = window.innerWidth;
}

init_context();
views.init_units();
views.config();

imgData = ctx.createImageData(canvas.width, canvas.height);
g.cascadeDraw(imgData, 0, 0);
ctx.putImageData(imgData, 0, 0);
