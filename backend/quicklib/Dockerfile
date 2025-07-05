FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy everything from current directory to container's working directory
COPY . .

# Build the app
RUN ./gradlew clean build -x test

# Expose the port the app runs on
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "build/libs/quicklib-0.0.1-SNAPSHOT.jar"]
