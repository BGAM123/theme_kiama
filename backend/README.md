# DocuAI Backend

Ce dépôt contient le backend de la plateforme DocuAI, basé sur le framework Spring Boot 3 et Java 21.
Il met en œuvre une architecture hexagonale simplifiée et expose une API REST pour l'ensemble des modules (Auth, Génération, IA, Extraction, Chat).

## Prérequis

- **Java 21** (JDK)
- **Maven 3.8+** (ou utilisez le wrapper Maven s'il est initialisé)
- **Docker** et **Docker Compose** (pour l'infrastructure locale)

## Architecture technique

*   **Framework principal** : Spring Boot 3.3.x
*   **Base de données** : PostgreSQL 16 (avec extension `pgvector` et `uuid-ossp`)
*   **Cache & Bus d'événements** : Redis (via Spring Data Redis)
*   **Stockage de fichiers** : MinIO (compatible S3)
*   **Migrations BDD** : Flyway
*   **Sécurité** : Spring Security, JWT (RS256), Rôles & Permissions
*   **Intelligence Artificielle** : Spring AI (OpenAI par défaut, adaptateurs multiples préparés)

## Démarrage rapide en local

### 1. Démarrer les services d'infrastructure

L'application dépend de PostgreSQL, Redis et MinIO. Ces services sont fournis dans le fichier `docker-compose.yml` situé à la racine du projet.

Pour tout démarrer, ouvrez un terminal dans ce dossier et exécutez :

```bash
docker-compose up -d
```

*(Si vous n'avez pas `docker-compose` mais la nouvelle commande Docker, utilisez `docker compose up -d`)*.

Assurez-vous que les conteneurs sont bien démarrés sans erreur :
- PostgreSQL (port local : 5432)
- Redis (port local : 6379)
- MinIO API (port local : 9000) et MinIO Console (port local : 9001)

### 2. Démarrer l'application Spring Boot

**Si vous avez Maven installé globalement :**

```bash
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

**Si le projet a été généré avec le wrapper Maven (`mvnw` / `mvnw.cmd`) :**

Sur Windows :
```powershell
.\mvnw.cmd clean spring-boot:run -Dspring-boot.run.profiles=dev
```

Sur Linux / macOS :
```bash
./mvnw clean spring-boot:run -Dspring-boot.run.profiles=dev
```

Au démarrage de l'application, **Flyway exécutera automatiquement les migrations**, créera toutes les tables nécessaires, et insérera les données de démarrage (Seed data) :
- Application prête sur `http://localhost:8080`
- Découverte des APIs (Swagger UI) sur `http://localhost:8080/swagger-ui.html`

### 3. Utilisateur administrateur par défaut

Une fois l'application démarrée et les migrations Flyway terminées, un administrateur est automatiquement créé (`V7__insert_seed_data.sql`) avec les identifiants suivants :

*   **Email** : `admin@docuai.admin`
*   **Mot de passe** : `Admin123!`

Vous pourrez utiliser cet identifiant pour appeler l'endpoint `/api/v1/auth/login` et récupérer votre token JWT.

## Modules principaux

*   `/api/v1/auth/*` : Authentification, génération de tokens JWT, déconnexion.
*   `/api/v1/users/*` : Gestion des utilisateurs (CRUD, statuts).
*   `/api/v1/roles/*` : Récupération des rôles existants.
*   `/api/v1/categories/*` : Gestion des catégories de documents.
*   `/api/v1/document-types/*` : Configuration et importation de documents sources.
*   `/api/v1/extraction-jobs/*` : Suivi d'état des asynchronismes d'extraction sur MinIO.
*   `/api/v1/chat/*` : Requêtes d'inférence RAG couplées au contexte document (Server-Sent Events).
*   `/api/v1/generations/*` : Génération finale du livrable et export DOCX/PDF.
*   `/api/v1/dashboard/*`, `/api/v1/ai-configs/*`, `/api/v1/notifications/*`, `/api/v1/audit-logs/*` : Support et administration globale de la plateforme.

## Notes sur l'IA (Module 11 & 12)

Par défaut, l'application est fournie avec l'adaptateur pour **OpenAI**. 
Assurez-vous de mettre à jour le composant de base de données via `AiModelConfigController` ou directement dans la BDD pour ajouter votre propre clé API `OPENAI_API_KEY` (les données brutes envoyées via l'API seront chiffrées en AES-256 dans PostgreSQL).

## Exécution des Test

```bash
mvn clean test
```
