FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY .mvn ./.mvn
COPY mvnw ./mvnw
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN addgroup -S docuai && adduser -S docuai -G docuai
COPY --from=builder /app/target/*.jar app.jar
USER docuai
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseZGC", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
