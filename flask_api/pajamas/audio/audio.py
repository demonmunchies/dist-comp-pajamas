from flask import Blueprint, render_template, request, make_response, jsonify
from flask import current_app as app
from flask_pymongo import ObjectId
from flask_socketio import emit
from pajamas.extensions import mongo, socketio
from datetime import datetime, timezone
from pajamas.users import authenticate
import uuid
import wave

bp = Blueprint('audio_bp', __name__)

@bp.route('/')
def index():
    return make_response(jsonify({'test': 'test'}), 200)

# @socketio.on('start-recording', namespace='/audio')
# def start_recording(options):
#     id = uuid.uuid4().hex  # server-side filename
#     session['wavename'] = id + '.wav'
#     wf = wave.open(current_app.config['FILEDIR'] + session['wavename'], 'wb')
#     wf.setnchannels(options.get('numChannels', 1))
#     wf.setsampwidth(options.get('bps', 16) // 8)
#     wf.setframerate(options.get('fps', 44100))
#     session['wavefile'] = wf

#emit('my_#event', {data:my_data}, broadcast=True, include_self=False)