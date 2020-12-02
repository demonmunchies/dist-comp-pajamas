from flask import Blueprint, render_template, request, make_response, jsonify
from pajamas.users import authenticate
from pajamas.extensions import mongo
from flask_pymongo import ObjectId
from datetime import datetime, timezone

bp = Blueprint('meetings_bp', __name__)

@bp.route('/', methods=['GET'])
def all_meetings():
    meetings = []
    for meeting in mongo.db.meetings.find()[0:50]:
        meeting_json = {
            'meeting_id': str(meeting['_id']),
            'title': meeting['title'],
            'start_date': meeting['start_date'],
            'end_date': meeting['end_date'],
            'creator_id': meeting['creator_id'],
            'participant_ids': meeting['participant_ids'],
            "creation_date": meeting['creation_date']
        }
        meetings.append(meeting_json)
    return make_response(jsonify(meetings), 200)

@bp.route('/add', methods=['POST'])
def add_meeting():
    post_data = request.json
    email = post_data.get('email')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'email': email})
    if user:
        user_id = user['_id']
        if authenticate(user_id, token):
            start_date = post_data.get('start_date')
            end_date = post_data.get('end_date')
            title = post_data.get('title')
            participant_ids = post_data.get('participant_ids')
            meeting = {
                'title': title,
                'start_date': start_date,
                'end_date': end_date,
                'creator_id': str(user_id),
                'participant_ids': participant_ids,
                "creation_date": datetime.now(timezone.utc)
            }
            mongo.db.meetings.insert_one(meeting)
            return make_response(jsonify({'status': 'success'}), 200)
    return make_response(jsonify({'status': 'failed'}), 200)

@bp.route('/get', methods=['POST'])
def get_meeting():
    post_data = request.json
    email = post_data.get('email')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'email': email})
    if user:
        user_id = user['_id']
        if authenticate(user_id, token):
            meeting_id = post_data.get('meeting_id')
            if meeting_id:
                meeting = mongo.db.meetings.find_one({'_id': ObjectId(meeting_id)})
                if meeting['creator_id'] == str(user_id):
                    meeting_obj = {
                        'title': meeting['title'],
                        'start_date': meeting['start_date'],
                        'end_date': meeting['end_date'],
                        'creator_id': meeting['creator_id'],
                        'participant_ids': meeting['participant_ids'],
                        "creation_date": meeting['creation_date']
                    }
                    return make_response(jsonify({'status': 'success', 'data': meeting_obj}), 200)
            else:
                meetings = []
                for meeting in mongo.db.meetings.find({'creator_id': str(user_id)}):
                    meeting_json = {
                        'meeting_id': str(meeting['_id']),
                        'title': meeting['title'],
                        'start_date': meeting['start_date'],
                        'end_date': meeting['end_date'],
                        'creator_id': meeting['creator_id'],
                        'participant_ids': meeting['participant_ids'],
                        "creation_date": meeting['creation_date']
                    }
                    meetings.append(meeting_json)
                return make_response(jsonify(meetings), 200)
    return make_response(jsonify({'status': 'failed'}), 200)
