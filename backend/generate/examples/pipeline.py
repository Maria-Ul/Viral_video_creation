from examples.viral_analysis import read_transcript, get_key_segments, segment_and_save_videos
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
    id = Column(Integer, primary_key=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

STATUS_CREATED = 'created'
STATUS_IN_PROGRESS = 'in_progress'
STATUS_DONE = 'done'

class Video(Base):
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

def generate(video_file, body):
    audio_file = "audio.wav"
    output_directory = 'data/processed'
    transcript_file = os.path.join(output_directory,'transcript.csv')

    os.makedirs(output_directory, exist_ok=True)

    model = Speech2TextConverter()
    model.make_transcription(video_file)
    model.get_df_transcript()

    df, text = read_transcript(transcript_file)
    key_time_segments = get_key_segments(df, text)
    output_file_path = os.path.join(output_directory,"final_video_with_audio.mp4")
    segment_and_save_videos(video_file, audio_file, key_time_segments, output_file_path)

    # Сохранение информации о видео в базу данных
    with SessionLocal() as db:
        # Рекурсивный обход папок
        for root, _, files in os.walk(output_directory):
            for file in files:
                if file.endswith(".mp4"):  # Проверка, что файл - видео
                    file_path = os.path.join(root, file)
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
                        options={'name': object_name, 'desc': 'desc', 'start_at': 'start_at', 'end_at': 'end_at', 'tags': ['tag1', 'tag2']}
                    )
                    db.session.add(clip)
                    db.session.commit()