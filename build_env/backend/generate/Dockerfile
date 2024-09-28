FROM python:3.10-slim-buster

WORKDIR /app

COPY ./backend/generate/requirements.txt ./

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y ffmpeg

COPY ./backend/generate .

CMD ["python", "main.py"]
