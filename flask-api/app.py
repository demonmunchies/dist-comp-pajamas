from flask import Flask, request, make_response, jsonify
from users.routes import users_bp

app = Flask(__name__)
app.config.from_object('config')
app.register_blueprint(users_bp, url_prefix='/users')

@app.route('/')
def index():
    return make_response(jsonify({'test': 'test worked!'}), 200)

@app.route('/meeting', methods=['GET', 'POST'])
def meeting():
    if request.method == 'POST':
        # logging new meeting info
        # get info from post
        # save to mongodb
        return True
    else:
        # getting meeting info from db
        # get id from get data
        # return info
        return False

@app.route('/upload', methods=['POST'])
def upload():
    # get audio file
    # transcribe
    # call BERT model
    return True 

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=app.config['DEBUG'])
