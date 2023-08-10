NETWORK_NAME := cargo-net

.PHONY: create_network

up-all:
	@echo "Checking if network $(NETWORK_NAME) exists..."
	@if ! docker network ls | grep -q $(NETWORK_NAME); then \
		echo "Creating network $(NETWORK_NAME)..."; \
		docker network create $(NETWORK_NAME); \
	fi
	@echo "Starting containers..."
	docker-compose up -d
	docker-compose ps -a

down:
	@echo "Stopping containers..."
	docker-compose down
	docker-compose ps -a

test-quote:
	@echo "Running quote tests..."
	cd services/quote && npx jest

	@sleep 1

	@echo "Running quote e2e tests..."
	cd services/quote && npm run test:e2e

test-metrics:
	@echo "Running metrics tests..."
	cd services/metrics && npx jest

	@sleep 1

	@echo "Running metrics e2e tests..."
	cd services/metrics && npm run test:e2e