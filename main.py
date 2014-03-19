import flask
import os

app = flask.Flask(__name__)

@app.route('/')
def display():
    html = '<script src="static/scripts/{0}"></script>'
    scripts = ['CascadeView.js', 'view.js', 'main.js']
    args = {
            'title': 'Title',
            'js': flask.Markup('\n'.join([html.format(fname) for fname in scripts])),
        }

    return flask.render_template('display.html', **args)

if __name__ == '__main__':
    app.debug = True
    app.run()
