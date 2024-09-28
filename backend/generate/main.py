import sys
import os
import pika
import json
import psycopg2
import io
from minio import Minio
from os import environ

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
        response = client.get_object(bucket_name=bucket, object_name=object_name)

        # Создаем BytesIO объект для хранения видео и запускаем нейронку

        # original_video = Image.open(io.BytesIO(response.data)) 
        
        
        

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