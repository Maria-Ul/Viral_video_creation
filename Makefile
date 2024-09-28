# Поднять прод окружение
up:
		docker compose up -d --build

# Удалить все контейнеры
ddown:
		docker ps -a  | cut -c 1-12 | xargs -i sh -c 'docker stop {} && docker rm -v {}'