import sys
import os
import pika
import json
import psycopg2
import io
from minio import Minio
from os import environ
import tempfile
from examples.pipeline import generate

conn = psycopg2.connect(dsn=environ.get('DATABASE_URL'))
cursor = conn.cursor()

def main():
    credentials = pika.PlainCredentials('user', 'password')
    parameters = pika.ConnectionParameters('rabbitmq', 5672, '/', credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='generate')

    def callback(ch, method, properties, body):
        body = json.loads(body)
        object_name = body["object_name"]
        
        client = Minio(environ.get('S3_ENDPOINT'), environ.get('S3_ACCESS_KEY'), environ.get('S3_SECRET_KEY'), secure=False)
        bucket = environ.get('S3_BUCKET_NAME')
        video_data = client.get_object(bucket_name=bucket, object_name=object_name).data
        video_stream = io.BytesIO(video_data)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            temp_file.write(video_stream.getvalue())
            temp_file.flush()

            # Получение пути до файла в файловой системе
            file_path = temp_file.name
            generate(file_path, body)
        
        
        

    channel.basic_consume(queue='generate', on_message_callback=callback, auto_ack=True)
    print(' [*] Waiting for messages. To exit press CTRL+C', file=sys.stderr)
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)