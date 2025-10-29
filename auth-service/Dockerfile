FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src/

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/auth-service-0.0.1-SNAPSHOT.jar"]