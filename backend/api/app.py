from os import environ
from flask_cors import CORS  
from flask import Flask, request, jsonify, redirect, url_for, send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from jwt import encode, decode  # Импорт функций из модулей 
import datetime
from functools import wraps
import pika
import json
from minio import Minio
import sys
import io
import uuid
import moviepy.editor as mp
import tempfile



app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = 'super_secret'
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(minutes=1440)
db = SQLAlchemy(app)

client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
bucket = environ.get('S3_BUCKET_NAME')
if False == client.bucket_exists(bucket):
    client.make_bucket(bucket)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

STATUS_CREATED = 'created'
STATUS_IN_PROGRESS = 'in_progress'
STATUS_DONE = 'done'

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(255), nullable=False)
    object_name = db.Column(db.String(255), nullable=False)
    options = db.Column(db.JSON, nullable=False)

    @property
    def serialize(self):
       return {
           'id'         : self.id,
           'user_id'  : self.user_id,
           'status'  : self.status,
           'object_name'  : self.object_name,
           'options'  : self.options,
       }

    def __repr__(self):
        return '<Video %r>' % self.id
# clip = Clip(
#                     video_id=video.id,
#                     object_name=clip_object_name,
#                     options={'name': 'name', 'desc': 'desc', 'start_at': 'start_at', 'end_at': 'end_at', 'tags': ['tag1', 'tag2']}
#                 )
#                 db.session.add(clip)
#                 db.session.commit()
class Clip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, nullable=False)
    object_name = db.Column(db.String(255), nullable=True)
    options = db.Column(db.JSON, nullable=False)

    @property
    def serialize(self):
       return {
           'id'         : self.id,
           'video_id'  : self.video_id,
           'object_name'  : self.object_name,
           'options'  : self.options,
       }

    def __repr__(self):
        return '<Clip %r>' % self.id

with app.app_context():
    db.create_all()

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        try:
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            data = decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return func(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'message': 'Missing username or password'}), 400
    username = data['username']
    password = data['password']
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    token = encode({'id': new_user.id, 'exp': datetime.datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']}, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'message': 'Missing username or password'}), 400
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401
    token = encode({'id': user.id, 'exp': datetime.datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']}, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token}), 200

@app.route('/video', methods=['POST'])
@token_required
def generate(current_user):
    if "video" not in request.files:
        return "No file part", 400

    file = request.files["video"]
    object_name = str(uuid.uuid4()) + '.' + file.filename.split('.')[-1]
    length = len(file.stream.read())
    file.stream.seek(0)
    client.put_object(
        bucket_name=bucket,
        object_name=object_name,
        data=file.stream,
        length=length, # Можно убрать, если используется length=None
        content_type=file.content_type,
    )
    # Создание клипов
    video_data = client.get_object(bucket_name=bucket, object_name=object_name).data
    video_stream = io.BytesIO(video_data)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
        temp_file.write(video_stream.getvalue())
        temp_file.flush()

        # Создаем VideoFileClip
        videoTemp = mp.VideoFileClip(temp_file.name)

        # Извлекаем первый кадр
        first_frame = videoTemp.get_frame(0)  # Получаем первый кадр (время в секундах)

        # Сохраняем первый кадр как изображение во временный файл
        preview_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
        mp.ImageClip(first_frame).save_frame(preview_temp_file.name, t=0)

        # Загружаем превью в S3
        preview_object_name = str(uuid.uuid4()) + '.jpg'
        with open(preview_temp_file.name, "rb") as img_file:
            preview_length = len(img_file.read())
            img_file.seek(0)  # Вернуться к началу файла для загрузки
            client.put_object(
                bucket_name=bucket,
                object_name=preview_object_name,
                data=img_file,
                length=preview_length,
                content_type='image/jpeg',
            )


        video = Video(
            user_id=current_user.id,
            status=STATUS_CREATED,
            object_name=object_name,
            options={
                'name': file.filename,
                'size': sys.getsizeof(temp_file),  # Размер в ГБ
                'duration': round(videoTemp.duration),  # Длительность в секундах
                'created_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),  # Формат даты и времени
                'preview': preview_object_name
            }
        )

        db.session.add(video)
        db.session.commit()
            
        body = {}
        body['id'] = video.id
        body['user_id'] = video.user_id
        body['object_name'] = video.object_name

        credentials = pika.PlainCredentials('user', 'password')
        parameters = pika.ConnectionParameters('rabbitmq', 5672, '/', credentials)
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue='generate')
        channel.basic_publish(exchange='', routing_key="generate", body=json.dumps(body))
        connection.close()
        
        return jsonify({"id": video.id}), 200

@app.route('/video', methods=['GET'])
@token_required
def videos(current_user):
    id_get = request.args.getlist('id')
    if id_get:
        history = Video.query.filter(Video.user_id == current_user.id, Video.id.in_(id_get)).order_by(Video.id.desc()).all()
    else:
        history = Video.query.filter(Video.user_id == current_user.id).order_by(Video.id.desc()).all()
    return jsonify([i.serialize for i in history]), 200

@app.route('/clip', methods=['GET'])
@token_required
def clips(current_user):
    video_id = request.args.get('video_id')
    
    # history = Clip.query.all()
    history = Clip.query.filter(Clip.video_id == int(video_id)).order_by(Clip.id.desc()).all()

    return jsonify([i.serialize for i in history]), 200

@app.route('/files/<object_name>', methods=['GET'])
# @token_required
def getFile(object_name):
    try:
        assert object_name == request.view_args['object_name']
        response = client.get_object(bucket_name=bucket, object_name=object_name)

        # Создаем BytesIO объект для хранения файла
        file_stream = io.BytesIO(response.data)

        # Получаем MIME-тип из заголовков
        content_type = response.headers['Content-Type']

        # Отправляем файл в ответ на HTTP-запрос
        return send_file(file_stream, mimetype=content_type)
    except Exception as e:
        # Обработка ошибок
        return 'Ошибка при получении файла: {}'.format(e), 500

@app.route('/video/<id>', methods=['DELETE'])
@token_required
def removeVideo(current_user, id):
    assert id == request.view_args['id']
    history = Video.query.filter(Video.id == id).first()
    if STATUS_DONE == history.status:
        client.remove_object(bucket_name=bucket, object_name=history.object_name)
    Video.query.filter(Video.id == id).delete()
    db.session.commit()
    return jsonify({}), 200

@app.route('/clip/<id>', methods=['DELETE'])
@token_required
def removeClip(current_user, id):
    assert id == request.view_args['id']
    Clip.query.filter(Clip.id == id).delete()
    db.session.commit()
    return jsonify({}), 200

@app.route('/image', methods=['DELETE'])
@token_required
def removeImages(current_user):
    histories = Video.query.filter(Video.user_id == current_user.id).all()
    Video.query.filter(Video.user_id == current_user.id).delete()
    for history in histories:
        if STATUS_DONE == history.status:
            client.remove_object(bucket_name=bucket, object_name=history.object_name)
    db.session.commit()
    return jsonify({}), 200

if __name__ == '__main__':
    # app.run(debug=True, host="109.248.37.46")
    app.run(host='0.0.0.0', port=4000)
    