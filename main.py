import flask
import os

app = flask.Flask(__name__)

def _gen_url(folder, files):
    return ['{0}/{1}'.format(folder, fname) for fname in files]

def _resources():
    js_html = '<script src="static/{0}"> </script>'
    js = _gen_url('scripts', ['CascadeView.js', 'view.js', 'main.js']) + _gen_url('Flat-UI/js', [
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

    lk_html = '<link href="static/Flat-UI/{0}" rel="stylesheet" />'
    flat_ui = ['bootstrap/css/bootstrap.css', 'css/flat-ui.css']

    return '\n'.join([js_html.format(fname) for fname in js]), '\n'.join([lk_html.format(fname) for fname in flat_ui])

@app.route('/')
def display():
    js, style = _resources()

    args = {
            'title': 'Title',
            'style': flask.Markup(style),
            'js': flask.Markup(js),
        }

    return flask.render_template('display.html', **args)

if __name__ == '__main__':
    app.debug = True
    app.run()
