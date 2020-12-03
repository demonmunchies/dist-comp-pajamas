from datetime import datetime, timezone
from flask import Blueprint, render_template, request, make_response, jsonify
from flask_pymongo import ObjectId
from pajamas.users import authenticate
from pajamas.extensions import mongo


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
    user_id = post_data.get('user_id')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
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
            meeting_id = mongo.db.meetings.insert_one(meeting).inserted_id
            return make_response(jsonify({'meeting_id': str(meeting_id)}), 200)
    return make_response(jsonify({'status': 'failed'}), 200)


@bp.route('/update', methods=['PUT'])
def update_meeting():
    post_data = request.json
    user_id = post_data.get('user_id')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        meeting_id = post_data.get('meeting_id')
        if authenticate(user_id, token) and meeting_id:
            start_date = post_data.get('start_date')
            end_date = post_data.get('end_date')
            title = post_data.get('title')
            participant_ids = post_data.get('participant_ids')

            changes = {}
            if title:
                changes["title"] = title
            if start_date:
                changes["start_date"] = start_date
            if end_date:
                changes["end_date"] = end_date
            if participant_ids:
                changes["participant_ids"] = participant_ids

            query = {"_id": ObjectId(meeting_id)}
            new_value = {"$set": changes}
            mongo.db.meetings.update_one(query, new_value)
            meeting = mongo.db.meetings.find_one(
                {'_id': ObjectId(meeting_id)})
            meeting_obj = {
                'meeting_id': str(meeting['_id']),
                'title': meeting['title'],
                'start_date': meeting['start_date'],
                'end_date': meeting['end_date'],
                'creator_id': meeting['creator_id'],
                'participant_ids': meeting['participant_ids'],
                "creation_date": meeting['creation_date']
            }
            return make_response(jsonify(meeting_obj), 200)
    return make_response(jsonify({'status': 'failed'}), 200)


@bp.route('/get', methods=['POST'])
def get_meeting():
    post_data = request.json
    user_id = post_data.get('user_id')
    token = post_data.get('token')
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if user:
        if authenticate(user_id, token):
            meeting_id = post_data.get('meeting_id')
            if meeting_id:
                meeting = mongo.db.meetings.find_one(
                    {'_id': ObjectId(meeting_id)})
                if meeting['creator_id'] == str(user_id):
                    meeting_obj = {
                        'meeting_id': str(meeting['_id']),
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
