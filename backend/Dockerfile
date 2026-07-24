FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN addgroup -S docuai && adduser -S docuai -G docuai
COPY --from=builder /app/target/*.jar app.jar
USER docuai
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseZGC", "-Dspring.profiles.active=dev", "-jar", "app.jar"]
