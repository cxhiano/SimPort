import flask
import os

app = flask.Flask(__name__)

def _gen_url(folder, files):
    return ['{0}/{1}'.format(folder, fname) for fname in files]

def _gen_html(temp, items):
    return flask.Markup('\n'.join([temp.format(item) for item in items]))

def _scripts():
    html = '<script src="static/{0}"> </script>'
    js = _gen_url('Flat-UI/js', [
            'jquery-1.8.3.min.js',
            'jquery-ui-1.10.3.custom.min.js',
            'jquery.ui.touch-punch.min.js',
            'bootstrap.min.js',
            'bootstrap-select.js',
            'bootstrap-switch.js',
            'flatui-checkbox.js',
            'flatui-radio.js',
            'jquery.tagsinput.js',
            'jquery.placeholder.js']
        )

    js += _gen_url('scripts', ['CascadeView.js', 'view.js', 'data.js', 'main.js'])

    return _gen_html(html, js)

def _styles():
    html = '<link href="static/Flat-UI/{0}" rel="stylesheet" />'
    flat_ui = ['bootstrap/css/bootstrap.css', 'css/flat-ui.css']

    return _gen_html(html, flat_ui)

def _inputs():
    temp = '<input id="{0}" type="text" placeholder="{0}" class="form-control" />'
    return _gen_html(temp, ['rows', 'columns', 'depotRows', 'depotColumns', 'maxStacks'])

@app.route('/')
def display():
    args = {
            'title': 'Title',
            'styles': _styles(),
            'inputs': _inputs(),
            'scripts': _scripts(),
        }

    return flask.render_template('display.html', **args)

if __name__ == '__main__':
    app.debug = True
    app.run()
