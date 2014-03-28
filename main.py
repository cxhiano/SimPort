import flask
import os

app = flask.Flask(__name__)

@app.route('/')
def display():
    inputs = [{
        'id': 'rows',
        'default': 5,
        }, {
        'id': 'columns',
        'default': 5,
        }, {
        'id': 'depotRows',
        'default': 5,
        }, {
        'id': 'depotColumns',
        'default': 5,
        }, {
        'id': 'maxStacks',
        'default': 6,
        }]

    scripts_libs = [
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

    custom_scripts = [
            'CascadeView.js',
            'view.js',
            'lift.js',
            'depot.js',
            'data.js',
            'main.js']

    args = {
            'title': 'Sim Port',
            'styles': ['bootstrap/css/bootstrap.css', 'css/flat-ui.css'],
            'inputs': inputs,
            'scripts_libs': scripts_libs,
            'custom_scripts': custom_scripts,
        }

    return flask.render_template('display.html', **args)

@app.route('/apis/test')
def test():
    return 'adfdafsadfdsaf'

if __name__ == '__main__':
    app.debug = True
    app.run()
