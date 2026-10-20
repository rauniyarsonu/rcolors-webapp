# One image serving both the React build and the API on port 8080.
#   docker build -t rcolors .
#   docker run -p 8080:8080 rcolors
# Add -e SPRING_PROFILES_ACTIVE=prod -e DATABASE_URL=... for PostgreSQL (see backend/src/main/resources).

FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json frontend/
RUN cd frontend && npm ci
COPY frontend frontend
COPY backend/src/main/resources/data backend/src/main/resources/data
RUN cd frontend && npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /app
COPY backend/pom.xml .
RUN mvn -q dependency:go-offline
COPY backend/src src
COPY --from=frontend /app/frontend/dist src/main/resources/static
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/rcolors-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
