dev:
	docker-compose -f docker-compose.yml up -d

prod:
	docker-compose -f docker-compose.prod.yml up -d

stop:
	docker-compose down