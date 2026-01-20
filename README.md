# VigilanceFrance
"Une France Vigilante, des habitants en sécurité"

## Vue d'ensemble

VigilanceFrance est une plateforme de signalement d'incidents civiques permettant aux citoyens de signaler et suivre divers types d'incidents sur une carte interactive. Le projet utilise une architecture microservices déployée sur Kubernetes.

## Binôme

- Rayane Achouchi
- Joao Gabriel Marques-Dinis

## Architecture

Le projet est composé de 5 microservices principaux :

- **API Gateway** : Point d'entrée unique pour toutes les requêtes
- **Auth Service** : Gestion de l'authentification (OAuth Google/GitHub)
- **Maps Service** : Gestion des incidents et données géographiques
- **Messages Service** : Gestion des messages et commentaires (WebSocket)
- **Notifs Service** : Gestion des notifications par email (Bull Queue)

**Infrastructure** :
- MongoDB 8.0.4 pour la persistance des données
- Redis 7.4.1 pour les sessions et le cache
- Kubernetes/Minikube pour l'orchestration

```
┌─────────────────────────────────────────────────────────────┐
│                         API Gateway                          │
│                     (Port: 3000)                             │
└──────────────┬──────────────┬───────────────┬───────────────┘
               │              │               │
       ┌───────▼─────┐  ┌────▼────┐   ┌──────▼────────┐
       │Auth Service │  │Maps     │   │Messages       │
       │(Port: 3001) │  │Service  │   │Service        │
       └──────┬──────┘  │(3002)   │   │(3003)         │
              │         └────┬────┘   └──────┬────────┘
              │              │                │
       ┌──────▼──────────────▼────────────────▼────────┐
       │            MongoDB (27017)                      │
       │         vigilance_france database              │
       └─────────────────────────────────────────────────┘
                          │
       ┌──────────────────▼────────────────────────────┐
       │            Redis (6379)                        │
       │       Sessions & Cache                         │
       └────────────────────────────────────────────────┘
```

## Prérequis

- Docker
- Minikube (8GB RAM minimum, 4 CPUs)
- kubectl
- Node.js 22
- npm/pnpm

## Installation et Déploiement

### 1. Démarrer Minikube

```bash
minikube start --memory=8192 --cpus=4
eval $(minikube docker-env)
```

### 2. Compiler les services TypeScript

```bash
# Auth Service
cd backend/microservices/auth-service
npm run build

# Maps Service
cd ../maps-service
npm run build

# Messages Service
cd ../messages-service
npm run build

# Notifs Service
cd ../notifs-service
npm run build
```

### 3. Construire les images Docker

```bash
# API Gateway
cd backend/api-gateway
docker build -t vigilance/api-gateway:latest .

# Microservices
cd ../microservices/auth-service
docker build -t vigilance/auth-service:latest .

cd ../maps-service
docker build -t vigilance/maps-service:latest .

cd ../messages-service
docker build -t vigilance/mess-service:latest .

cd ../notifs-service
docker build -t vigilance/notifs-service:latest .
```

### 4. Déployer sur Kubernetes

```bash
cd /home/saphirdev/VigilanceFrance
kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/secrets.yaml
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/databases/
kubectl apply -f k8s/microservices/
```

### 5. Vérifier le déploiement

```bash
kubectl get pods -n vigilance-france
```

**screenshot: Status des pods Kubernetes montrant tous les services en Running**

```bash
kubectl logs -f <pod-name> -n vigilance-france
```

**screenshot: Logs d'un service montrant la connexion réussie à MongoDB et Redis**

### 6. Accéder à l'application

```bash
minikube service api-gateway-service -n vigilance-france --url
```

L'API Gateway sera accessible sur l'URL fournie (exemple: `http://127.0.0.1:41007`)

## Configuration

La configuration se fait via ConfigMaps et Secrets Kubernetes :

- **ConfigMap** (`k8s/base/configmap.yaml`) : Variables d'environnement non sensibles
- **Secrets** (`k8s/base/secrets.yaml`) : Mots de passe et clés secrètes

Variables importantes :
- `MONGO_HOST`, `MONGO_PORT`, `MONGO_DB`, `MONGO_USER`, `MONGO_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PSWD`
- URLs des services pour l'API Gateway

## Utilisation

### Frontend (Local)

Le frontend est conçu pour tourner localement (pas dans Kubernetes) :

```bash
cd client
yarn install
yarn dev
```

**screenshot: Page d'accueil de l'application**

**screenshot: Page de connexion avec les boutons OAuth (Google/GitHub)**

### Signaler un incident

1. Se connecter via OAuth
2. Cliquer sur la carte pour positionner l'incident
3. Sélectionner le type d'incident
4. Ajouter une description
5. Soumettre

**screenshot: Interface de signalement d'incident avec la carte interactive**

**screenshot: Carte avec plusieurs incidents affichés avec leurs icônes**

### API Endpoints

#### Auth Service
- `GET /health` - Health check
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /oauth/google` - OAuth Google
- `GET /oauth/github` - OAuth GitHub

#### Maps Service
- `GET /health` - Health check
- `GET /incidents` - Liste des incidents
- `POST /incidents` - Créer un incident
- `GET /incidents/:id` - Détails d'un incident

#### Messages Service
- WebSocket pour les messages en temps réel
- `POST /comments` - Ajouter un commentaire

#### Notifs Service
- `POST /notify` - Envoyer une notification

**screenshot: Réponse JSON du endpoint /health d'un service**

## Monitoring

### Vérifier l'état des services

```bash
# Liste des pods
kubectl get pods -n vigilance-france

# Liste des services
kubectl get services -n vigilance-france

# Logs d'un service
kubectl logs -f <pod-name> -n vigilance-france
```

**screenshot: Liste des services Kubernetes avec leurs ports**

### Tester la connectivité

```bash
# Depuis l'API Gateway vers un microservice
kubectl exec -it <api-gateway-pod> -n vigilance-france -- wget -O- http://auth-service:3001/health
```

**screenshot: Test de connectivité réussi entre services**

## Troubleshooting

### Pod en CrashLoopBackOff
```bash
kubectl describe pod <pod-name> -n vigilance-france
kubectl logs <pod-name> -n vigilance-france
```

Causes communes :
- Erreurs de connexion MongoDB/Redis
- Variables d'environnement manquantes
- Health checks échouant

### Erreur de connexion MongoDB

Vérifier que `authSource: "admin"` est configuré dans les connexions Mongoose.

### Images Docker non trouvées

```bash
eval $(minikube docker-env)
docker images | grep vigilance
```

Reconstruire les images si nécessaire avec `--no-cache`.

### Redémarrer un service

```bash
kubectl delete pod <pod-name> -n vigilance-france
```

Kubernetes recréera automatiquement le pod.

## Technologies

**Backend** :
- Node.js 22 / TypeScript
- Express.js
- Mongoose (MongoDB ODM)
- Bull (Queue Redis)
- Passport.js (OAuth)
- WebSocket (Socket.io)

**Frontend** :
- React
- TypeScript
- Leaflet (cartes)
- Yarn

**DevOps** :
- Docker
- Kubernetes / Minikube
- MongoDB 8.0.4
- Redis 7.4.1

## Sécurité

- Authentification OAuth 2.0 (Google, GitHub)
- Sessions sécurisées avec Redis
- Secrets Kubernetes pour données sensibles
- authSource configuré pour MongoDB
- Variables d'environnement pour configuration

## Auteur

Projet VigilanceFrance - "Une France Vigilante, des habitants en sécurité"
