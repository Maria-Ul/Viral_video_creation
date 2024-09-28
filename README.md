# Viral Clip Creator Service

This repository contains the code for a service that takes video as input and generates viral-worthy clips using advanced artificial intelligence techniques. The service analyzes the video content, identifies key highlights, and processes the video to create engaging, shareable clips optimized for virality on social media platforms.

## Features

- **AI-Powered Video Analysis**: Automatically detects the most engaging moments using deep learning models for visual and audio analysis.

## How It Works

1. **Input**: Upload a video file or provide a link to an existing video.
2. **Processing**: The AI model analyzes the video for key highlights, trends, and emotional cues to identify segments with high engagement potential.
3. **Output**: The service generates a short, attention-grabbing viral clip, optimized for social sharing.

## Technologies Used

- **Deep Learning**: For video and audio analysis, including sentiment analysis, and scene segmentation.
- **Computer Vision**: To identify visual patterns and select the most impactful frames.
- **Natural Language Processing**: For subtitle generation and context analysis when speech is present.

### Для работы с проектом нужны:

- `Docker Compose version v2.19.1`
  
- `GNU Make 4.2.1`
  
- Видеокарта с CUDA (NVidia > 8 GB)

- Оперативная память > 16 GB

### Основные команды

- Запуск DEV окружения - команда `make dev`

- Запуск PROD окружения - команда `make prod`

- Остановить работу приложения - команда `make ddown`

### Структура проекта

/build_env - все необходимое для docker окружения

/frontend - клиентское приложение

/backend - серверное приложение

