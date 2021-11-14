.PHONY: install build up down restart logs

install:
	npm install

build:
	docker build .

up:
	docker-compose up -d

down:
	docker-compose down

start:
	docker-compose start

stop:
	docker-compose stop

restart:
	docker-compose restart

logs:
	docker-compose logs

dev:
	yarn gulp watch
