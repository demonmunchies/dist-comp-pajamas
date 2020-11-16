from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config.from_object('config')
mongo = PyMongo(app)

@app.route('/')
def index():
  return '<h1>Sup</h1>'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=app.config['DEBUG'])