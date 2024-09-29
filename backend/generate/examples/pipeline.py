from examples.viral_analysis import read_transcript, get_key_segments, segment_and_save_videos, process_seg
from src.utils.speech2text import Speech2TextConverter
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from os import environ
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, JSON
from minio import Minio


engine = create_engine(environ.get('DATABASE_URL'))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
bucket = environ.get('S3_BUCKET_NAME')


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

STATUS_CREATED = 'created'
STATUS_IN_PROGRESS = 'in_progress'
STATUS_DONE = 'done'

class Video(Base):
    __tablename__ = 'video'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    status = Column(String(255), nullable=False)
    object_name = Column(String(255), nullable=False)
    options = Column(JSON, nullable=False)

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

class Clip(Base):
    __tablename__ = 'clip'
    id = Column(Integer, primary_key=True)
    video_id = Column(Integer, nullable=False)
    object_name = Column(String(255), nullable=True)
    options = Column(JSON, nullable=False)

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
def t(a):
    return a[0]

def generate(video_file, body):
    with SessionLocal() as db:
        video = db.query(Video).filter(Video.id == body["id"]).first()  # Используйте db.query вместо Video.query
        video.status = STATUS_IN_PROGRESS  # Обновляем опции
        db.add(video)
        db.commit()
    audio_file = "audio.wav"
    output_directory = 'data/processed'
    transcript_file = os.path.join(output_directory,'transcript.csv')

    os.makedirs(output_directory, exist_ok=True)

    model = Speech2TextConverter()
    model.make_transcription(video_file)
    model.save_df_transcript(transcript_file)

    df, text = read_transcript(transcript_file)
    # print('df[:10] ', df[:10], '\n')
    key_time_segments = get_key_segments(df, text)
    output_file_path = os.path.join(output_directory,"final_video_with_audio.mp4")
    print('key_time_segments: ', key_time_segments, '\n')
    key_time_segments = process_seg(key_time_segments)
    print('key_time_segments: ', key_time_segments, '\n')
    segment_and_save_videos(video_file, audio_file, key_time_segments, output_directory)

    # Сохранение информации о видео в базу данных
    with SessionLocal() as db:

        i = 0
        
        segment_options = []
        # sorted_segments = sorted([(row['start'], row['end'], row['text']) for row in key_time_segments], key=lambda x: x[0])
        for start_time, end_time, text in key_time_segments:  # Исправьте здесь на правильные переменные
            
            i = i+1
            segment_options.append({'start': start_time, 'end': end_time, 'text': text})

        video = db.query(Video).filter(Video.id == body["id"]).first()  # Используйте db.query вместо Video.query
        video.options['segments'] = segment_options  # Обновляем опции
        print('key_time_segments 1111:', key_time_segments)
        print('segment_options:', segment_options)

        db.add(video)
        db.commit()

        print("segements:", i)
        i = -1
        # Рекурсивный обход папок
        # for root, _, files in os.walk(output_directory):
        for i in range(len(segment_options)):
            file_path = os.path.join(output_directory, f"output{str(i+1).zfill(3)}.mp4")    
            # for file in files:
            #     if file.endswith(".mp4"):  # Проверка, что файл - видео
            #         file_path = os.path.join(root, file)
            object_name = os.path.relpath(file_path, output_directory)  # Получение относительного пути

            # Загрузка в S3
            with open(file_path, "rb") as f:
                client.put_object(
                    bucket_name=bucket,
                    object_name=object_name,
                    data=f,
                    length=os.path.getsize(file_path),
                    content_type="video/mp4",
                )

        
            # Сохранение в БД
            clip = Clip(
                video_id=body['id'],
                object_name=object_name,
                options={
                    'name': object_name,
                    'desc': segment_options[i]['text'],
                    'start_at': segment_options[i]['start'],
                    'end_at': segment_options[i]['end'],
                    'tags': ['tag1', 'tag2']
                    }
            )
            db.add(clip)
            db.commit()

        print("clipsL:", i)
        video = db.query(Video).filter(Video.id == body["id"]).first()  # Используйте db.query вместо Video.query
        video.status = STATUS_DONE  # Обновляем опции
        db.add(video)
        db.commit()