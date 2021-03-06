import pathlib
import os
import wave
import json
from flask import (
    Flask,
    make_response,
    jsonify,
    url_for,
    render_template,
    redirect,
    request,
    Blueprint,
    current_app
)
from flask_socketio import emit, join_room, leave_room
from google.cloud import speech
from pajamas.extensions import mongo, socketio, model


bp = Blueprint('audio_bp', __name__, template_folder='templates')


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/chat', methods=['POST'])
def chat():
    name = request.form.get('name')
    room = request.form.get('room')
    if not name or not room:
        return redirect(url_for('audio_bp.index'))
    return render_template('chat.html', name=name, room=room)


@bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = []
    for room in mongo.db.rooms.find():
        rooms.append([str(room['_id']), room['room_id'], room['members']])
    return make_response({'data': rooms}, 200)


@socketio.on('send-audio', namespace='/audio')
def audio(data):
    name = data.get('name')
    room_id = data.get('room')
    blob = data.get('blob')
    filename = f'{room_id}_{name}.bat'
    append_binary(filename, blob)
    emit('receive-audio', {'data': blob}, broadcast=True, include_self=False)


@socketio.on('joined', namespace='/audio')
def joined(data):
    name = data.get('name')
    room_id = data.get('room')
    room = get_room(room_id)
    if not room:
        print('created room')
        create_room(room_id)
    add_room_member(room_id, name)
    join_room(room_id)
    emit('status', {'msg': name + ' has entered the room.'}, room=room_id)


@socketio.on('left', namespace='/audio')
def left(data):
    name = data.get('name')
    room_id = data.get('room')
    leave_room(room_id)
    remove_room_member(room_id, name)
    emit('status', {'msg': name + ' has left the room.'}, room=room_id)


def add_room_member(room_id, name):
    members = get_room_members(room_id)
    members.append(name)
    mongo.db.rooms.update_one({'room_id': room_id}, {'$set': {'members': members}})


def remove_room_member(room_id, name):
    members = get_room_members(room_id)
    members.remove(name)
    if len(members) == 0:
        delete_room(room_id)
        binary_to_wave(room_id)
    else:
        mongo.db.rooms.update_one({'room_id': room_id}, {'$set': {'members': members}})


def get_room_members(room_id):
    room = get_room(room_id)
    return room['members']


def get_room(room_id):
    return mongo.db.rooms.find_one({'room_id': room_id})


def create_room(room_id):
    mongo.db.rooms.insert_one({'room_id': room_id, 'members': [], 'filename': room_id + '.wav'})


def delete_room(room_id):
    mongo.db.rooms.delete_one({'room_id': room_id})


def append_binary(filename, data):
    audio_dir = current_app.config['AUDIO_DIR']
    with open(f'{audio_dir}/{filename}', 'ab') as f:
        f.write(data)


def binary_to_wave(room_id):
    audio_dir = current_app.config['AUDIO_DIR']
    bin_filenames = [filename for filename in os.listdir(audio_dir) if filename.startswith(room_id)]
    for bin_filename in bin_filenames:
        file_id = pathlib.Path(bin_filename).stem
        wav_filename = f'{file_id}.wav'
        with open(f'{audio_dir}/{bin_filename}', 'rb') as f:
            wf = wave.open(f'{audio_dir}/{wav_filename}', 'wb')
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            wf.writeframes(f.read())
            wf.close()
        transcribe_file(file_id)
        predict_file(file_id)


def transcribe_file(file_id):
    audio_dir = current_app.config['AUDIO_DIR']
    speech_file = f'{audio_dir}/{file_id}.wav'
    transcription_file = f'{audio_dir}/{file_id}.txt'

    client = speech.SpeechClient()
    with open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )
    operation = client.long_running_recognize(config=config, audio=audio)

    response = operation.result(timeout=90)
    transcribed_text = response.results[0].alternatives[0].transcript
    with open(transcription_file, 'w') as f:
        f.write(transcribed_text)


def predict_file(file_id):
    audio_dir = current_app.config['AUDIO_DIR']
    with open(f'{audio_dir}/{file_id}.txt', 'r') as f:
        text = f.read()
    tokens, labels = model.predict(text)
    json_obj = {
        'tokens': tokens,
        'labels': labels
    }
    with open(f'{audio_dir}/{file_id}.json', 'w') as f:
        json.dump(json_obj, f)
