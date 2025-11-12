FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y maven && mvn clean install
EXPOSE 8080
CMD ["java", "-jar", "target/bookstore-app.jar"]

