# Build stage - use native architecture for building
FROM --platform=$BUILDPLATFORM eclipse-temurin:21-jdk AS builder

# Set the working directory
WORKDIR /app

# Copy gradle files first
COPY gradle/ gradle/
COPY gradlew gradlew.bat build.gradle settings.gradle ./

# Make gradlew executable
RUN chmod +x ./gradlew

# Copy source code
COPY src/ src/

# Build the app
RUN ./gradlew clean build -x test

# Runtime stage - use target architecture
FROM eclipse-temurin:21-jre

ARG VERSION_NAME=unknown
ENV VERSION_NAME=${VERSION_NAME}

WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /app/build/libs/quicklib-0.0.1-SNAPSHOT.jar app.jar

# Create a directory for external config
RUN mkdir -p /app/config

# Expose the port the app runs on
EXPOSE 8080

# Run the app with external config directory
CMD ["java", "-jar", "-Dspring.config.additional-location=file:/app/config/", "app.jar"]
