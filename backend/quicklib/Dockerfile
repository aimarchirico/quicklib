FROM eclipse-temurin:17-jdk

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

# Create a directory for external config
RUN mkdir -p /app/config

# Expose the port the app runs on
EXPOSE 8080

# Run the app with external config directory
CMD ["java", "-jar", "-Dspring.config.additional-location=file:/app/config/", "build/libs/quicklib-0.0.1-SNAPSHOT.jar"]
