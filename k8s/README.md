# 🚀 Déploiement Kubernetes - VigilanceFrance

Ce guide explique comment déployer l'application VigilanceFrance sur un cluster Kubernetes avec Minikube.

## 📋 Prérequis

### Logiciels requis

1. **Minikube** (v1.30+)
   ```bash
   # Installation sur Linux
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   ```

2. **kubectl** (v1.27+)
   ```bash
   # Installation sur Linux
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

3. **Docker** (v20.10+)
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io
   sudo usermod -aG docker $USER
   ```

### Configuration système minimale

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Stockage**: 20 GB disponibles

## 🏗️ Architecture Kubernetes

```
vigilance-france (namespace)
│
├── Databases
│   ├── MongoDB (Deployment + Service + PVC)
│   └── Redis (Deployment + Service + PVC)
│
├── Microservices
│   ├── auth-service (Deployment + Service) × 2 replicas
│   ├── maps-service (Deployment + Service) × 2 replicas
│   ├── mess-service (Deployment + Service) × 2 replicas
│   └── notifs-service (Deployment + Service) × 1 replica
│
├── API Gateway
│   └── api-gateway (Deployment + Service) × 2 replicas
│
└── Frontend
    └── frontend (Deployment + Service + Ingress) × 2 replicas
```

## 🚀 Déploiement rapide (Automatique)

### Option 1: Script automatique (RECOMMANDÉ)

```bash
cd /home/saphirdev/VigilanceFrance
./k8s/deploy.sh
```

Ce script va:
1. ✅ Vérifier les outils (minikube, kubectl, docker)
2. ✅ Démarrer Minikube avec les ressources nécessaires
3. ✅ Activer les addons (ingress, metrics-server)
4. ✅ Builder toutes les images Docker
5. ✅ Déployer tous les composants Kubernetes
6. ✅ Attendre que tout soit opérationnel
7. ✅ Afficher l'URL d'accès

**Durée estimée**: 5-10 minutes

### Option 2: Déploiement manuel (Étape par étape)

#### 1. Démarrer Minikube

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

#### 2. Activer les addons

```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

#### 3. Utiliser le Docker daemon de Minikube

```bash
eval $(minikube docker-env)
```

#### 4. Builder les images Docker

```bash
# Auth Service
docker build -t vigilance/auth-service:latest ./backend/microservices/auth-service

# Maps Service
docker build -t vigilance/maps-service:latest ./backend/microservices/maps-service

# Messages Service
docker build -t vigilance/mess-service:latest ./backend/microservices/messages-service

# Notifications Service
docker build -t vigilance/notifs-service:latest ./backend/microservices/notifs-service

# API Gateway
docker build -t vigilance/api-gateway:latest ./backend/api-gateway

# Frontend
docker build -t vigilance/frontend:latest ./client
```

#### 5. Déployer sur Kubernetes

```bash
# Namespace
kubectl apply -f k8s/base/namespace.yaml

# ConfigMaps et Secrets
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secrets.yaml

# Persistent Volumes
kubectl apply -f k8s/databases/persistent-volumes.yaml

# Databases
kubectl apply -f k8s/databases/mongodb.yaml
kubectl apply -f k8s/databases/redis.yaml

# Attendre que les DBs soient prêtes
kubectl wait --for=condition=ready pod -l app=mongodb -n vigilance-france --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n vigilance-france --timeout=120s

# Microservices
kubectl apply -f k8s/microservices/auth-service.yaml
kubectl apply -f k8s/microservices/maps-service.yaml
kubectl apply -f k8s/microservices/mess-service.yaml
kubectl apply -f k8s/microservices/notifs-service.yaml

# API Gateway
kubectl apply -f k8s/microservices/api-gateway.yaml

# Frontend
kubectl apply -f k8s/frontend/frontend.yaml
```

## 🌐 Accéder à l'application

### Méthode 1: Via NodePort

```bash
# Obtenir l'IP de Minikube
minikube ip

# Accéder via le navigateur
http://<MINIKUBE_IP>:30000
```

### Méthode 2: Via Minikube service

```bash
minikube service frontend-service -n vigilance-france
```

### Méthode 3: Via Ingress (optionnel)

```bash
# Obtenir l'IP de Minikube
MINIKUBE_IP=$(minikube ip)

# Ajouter à /etc/hosts
echo "$MINIKUBE_IP vigilance-france.local" | sudo tee -a /etc/hosts

# Accéder via le navigateur
http://vigilance-france.local
```

## 📊 Monitoring et Debugging

### Voir les pods

```bash
kubectl get pods -n vigilance-france
```

### Voir les services

```bash
kubectl get services -n vigilance-france
```

### Voir les logs d'un pod

```bash
# Lister les pods
kubectl get pods -n vigilance-france

# Voir les logs
kubectl logs <pod-name> -n vigilance-france

# Suivre les logs en temps réel
kubectl logs -f <pod-name> -n vigilance-france
```

### Accéder à un pod (shell)

```bash
kubectl exec -it <pod-name> -n vigilance-france -- /bin/sh
```

### Dashboard Kubernetes

```bash
minikube dashboard
```

### Métriques

```bash
# Top pods (CPU/Memory)
kubectl top pods -n vigilance-france

# Top nodes
kubectl top nodes
```

## 🔧 Configuration

### Modifier les variables d'environnement

Éditez le fichier `k8s/base/configmap.yaml` puis appliquez:

```bash
kubectl apply -f k8s/base/configmap.yaml
kubectl rollout restart deployment -n vigilance-france
```

### Modifier les secrets

Éditez le fichier `k8s/base/secrets.yaml` puis appliquez:

```bash
kubectl apply -f k8s/base/secrets.yaml
kubectl rollout restart deployment -n vigilance-france
```

### Scaler un service

```bash
# Augmenter le nombre de replicas
kubectl scale deployment auth-service --replicas=3 -n vigilance-france

# Vérifier
kubectl get deployments -n vigilance-france
```

## 🗑️ Nettoyage

### Script automatique

```bash
./k8s/cleanup.sh
```

### Manuel

```bash
# Supprimer tout le namespace (supprime tous les composants)
kubectl delete namespace vigilance-france

# Supprimer les PersistentVolumes
kubectl delete pv mongodb-pv redis-pv

# Arrêter Minikube
minikube stop

# Supprimer le cluster Minikube
minikube delete
```

## 🐛 Troubleshooting

### Les pods ne démarrent pas

```bash
# Voir les événements
kubectl get events -n vigilance-france --sort-by='.lastTimestamp'

# Décrire un pod problématique
kubectl describe pod <pod-name> -n vigilance-france
```

### Images non trouvées (ImagePullBackOff)

```bash
# Vérifier que vous utilisez le Docker daemon de Minikube
eval $(minikube docker-env)

# Lister les images disponibles
docker images | grep vigilance

# Rebuild les images si nécessaire
docker build -t vigilance/auth-service:latest ./backend/microservices/auth-service
```

### Base de données non accessible

```bash
# Vérifier que MongoDB et Redis sont running
kubectl get pods -n vigilance-france | grep -E "mongodb|redis"

# Vérifier les services
kubectl get services -n vigilance-france | grep -E "mongodb|redis"

# Tester la connexion depuis un pod
kubectl run -it --rm debug --image=mongo:8.0.4 --restart=Never -n vigilance-france -- mongosh mongodb://mongodb-service:27017
```

### Frontend ne se connecte pas au backend

```bash
# Vérifier les variables d'environnement
kubectl exec -it <frontend-pod> -n vigilance-france -- env | grep VITE

# Vérifier que l'API Gateway est accessible
kubectl exec -it <frontend-pod> -n vigilance-france -- wget -O- http://api-gateway-service:3000/v1/auth/health
```

## 📝 Structure des fichiers

```
k8s/
├── base/
│   ├── namespace.yaml          # Namespace vigilance-france
│   ├── configmap.yaml          # Variables d'environnement
│   └── secrets.yaml            # Données sensibles (JWT, OAuth, etc.)
│
├── databases/
│   ├── persistent-volumes.yaml # PV et PVC pour MongoDB et Redis
│   ├── mongodb.yaml            # MongoDB Deployment + Service
│   └── redis.yaml              # Redis Deployment + Service
│
├── microservices/
│   ├── auth-service.yaml       # Auth Deployment + Service
│   ├── maps-service.yaml       # Maps Deployment + Service
│   ├── mess-service.yaml       # Messages Deployment + Service
│   ├── notifs-service.yaml     # Notifs Deployment + Service
│   └── api-gateway.yaml        # API Gateway Deployment + Service
│
├── frontend/
│   └── frontend.yaml           # Frontend Deployment + Service + Ingress
│
├── deploy.sh                   # Script de déploiement automatique
├── cleanup.sh                  # Script de nettoyage
└── README.md                   # Cette documentation
```

## 🎯 Concepts Kubernetes démontrés

### ✅ Déployés dans ce projet:

1. **Namespace** - Isolation des ressources
2. **ConfigMap** - Gestion de la configuration
3. **Secret** - Gestion des données sensibles
4. **PersistentVolume & PersistentVolumeClaim** - Stockage persistant
5. **Deployment** - Déploiement et réplication des applications
6. **Service** - Exposition interne des services
   - ClusterIP (communication interne)
   - NodePort (accès externe)
7. **Ingress** - Routage HTTP/HTTPS
8. **Probes** - Liveness et Readiness checks
9. **Resources** - Limits et requests (CPU, Memory)
10. **Labels & Selectors** - Organisation et sélection des ressources
11. **Replicas** - Haute disponibilité
12. **SessionAffinity** - Sticky sessions pour WebSocket

## 📚 Ressources utiles

- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Minikube](https://minikube.sigs.k8s.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 👨‍💻 Auteurs

Projet réalisé dans le cadre du cours de Conteneurisation et Orchestration.

---

**Note**: Ce déploiement est configuré pour un environnement de développement avec Minikube. Pour un déploiement en production, il faudrait:
- Utiliser des Secrets externes (Vault, AWS Secrets Manager)
- Configurer TLS/SSL
- Utiliser des StorageClass adaptés
- Mettre en place du monitoring (Prometheus, Grafana)
- Configurer des NetworkPolicies
- Utiliser un Ingress Controller en production (NGINX, Traefik)
