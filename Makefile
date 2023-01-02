setup:
	@echo "#---------------------------#"
	@echo "# 環境構築を行います"
	@echo "#---------------------------#"
	docker-compose up -d
	npm i
run:
	@echo "#---------------------------#"
	@echo "# kafkaConsumerを起動します"
	@echo "#---------------------------#"
	npm run start:dev