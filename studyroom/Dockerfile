FROM openjdk:24-jdk
LABEL authors="Henry"

ARG JAR_FILE=target/*.jar
COPY ./target/studyroom-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]