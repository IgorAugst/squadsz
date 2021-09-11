.PHONY: build up down restart logs

build:
	docker build .

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs