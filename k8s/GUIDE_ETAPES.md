# 📝 GUIDE COMPLET - Déploiement Kubernetes pour votre projet

## 🎯 Ce qui a été créé

Tous les fichiers Kubernetes nécessaires ont été créés dans le dossier `/k8s/`:

```
k8s/
├── base/
│   ├── namespace.yaml          ✅ Namespace isolé
│   ├── configmap.yaml          ✅ Variables d'environnement
│   └── secrets.yaml            ✅ Secrets (OAuth, JWT, etc.)
│
├── databases/
│   ├── persistent-volumes.yaml ✅ Stockage persistant
│   ├── mongodb.yaml            ✅ Base de données MongoDB
│   └── redis.yaml              ✅ Cache Redis
│
├── microservices/
│   ├── auth-service.yaml       ✅ Service d'authentification
│   ├── maps-service.yaml       ✅ Service de cartes
│   ├── mess-service.yaml       ✅ Service de messages (WebSocket)
│   ├── notifs-service.yaml     ✅ Service de notifications
│   └── api-gateway.yaml        ✅ API Gateway (reverse proxy)
│
├── frontend/
│   └── frontend.yaml           ✅ Application React + Ingress
│
├── deploy.sh                   ✅ Script de déploiement automatique
├── cleanup.sh                  ✅ Script de nettoyage
├── README.md                   ✅ Documentation complète
└── QUICKSTART.md               ✅ Guide rapide
```

## 📋 ÉTAPES À SUIVRE POUR LE DÉPLOIEMENT

### ✅ Étape 1: Vérifier l'installation de Minikube

```bash
# Vérifier que minikube est installé
minikube version

# Si pas installé:
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### ✅ Étape 2: Vérifier l'installation de kubectl

```bash
# Vérifier que kubectl est installé
kubectl version --client

# Si pas installé:
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### ✅ Étape 3: Démarrer Minikube

```bash
# Démarrer Minikube avec suffisamment de ressources
minikube start --cpus=4 --memory=8192 --driver=docker

# Vérifier le statut
minikube status
```

**Résultat attendu:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### ✅ Étape 4: Lancer le déploiement automatique

```bash
cd /home/saphirdev/VigilanceFrance
./k8s/deploy.sh
```

**Ce script va:**
1. Vérifier les outils (2 secondes)
2. Configurer Minikube (10 secondes)
3. Builder les 6 images Docker (3-5 minutes)
4. Déployer tous les composants Kubernetes (2-3 minutes)
5. Afficher l'URL d'accès

**Durée totale: 5-10 minutes**

### ✅ Étape 5: Vérifier que tout fonctionne

```bash
# Voir tous les pods
kubectl get pods -n vigilance-france

# Attendre que tous les pods soient "Running"
# Cela peut prendre 1-2 minutes pour MongoDB et les microservices
```

**Résultat attendu (exemple):**
```
NAME                              READY   STATUS    RESTARTS   AGE
api-gateway-7d8f9c5b6-abc12       1/1     Running   0          2m
auth-service-6c5d8b4f7-def34      1/1     Running   0          3m
auth-service-6c5d8b4f7-ghi56      1/1     Running   0          3m
frontend-5b4c7a6d8-jkl78          1/1     Running   0          1m
frontend-5b4c7a6d8-mno90          1/1     Running   0          1m
maps-service-8d7f6c5b4-pqr12      1/1     Running   0          3m
maps-service-8d7f6c5b4-stu34      1/1     Running   0          3m
mess-service-9c8d7b6a5-vwx56      1/1     Running   0          3m
mess-service-9c8d7b6a5-yza78      1/1     Running   0          3m
mongodb-5d6c8b7a4-bcd90           1/1     Running   0          5m
notifs-service-7b6d8a5c4-efg12    1/1     Running   0          3m
redis-6c8d7b5a4-hij34             1/1     Running   0          5m
```

### ✅ Étape 6: Accéder à l'application

```bash
# Méthode simple (recommandée)
minikube service frontend-service -n vigilance-france
```

→ Cela ouvre automatiquement l'application dans votre navigateur

**OU manuellement:**

```bash
# Obtenir l'IP de Minikube
minikube ip
# Exemple: 192.168.49.2

# Ouvrir dans le navigateur:
# http://192.168.49.2:30000
```

### ✅ Étape 7: Tester l'application

1. **Page d'accueil**: Devrait charger correctement
2. **S'inscrire**: Créer un compte test
3. **Se connecter**: Tester l'authentification
4. **Carte**: Voir la carte interactive
5. **Créer un incident**: Ajouter un incident sur la carte
6. **Commentaires**: Tester les commentaires temps réel

## 📸 CAPTURES D'ÉCRAN POUR LE RENDU

### Captures à prendre:

1. **État du cluster**
```bash
kubectl get all -n vigilance-france
```
→ Capture d'écran de la sortie

2. **Pods en fonctionnement**
```bash
kubectl get pods -n vigilance-france
```
→ Capture d'écran montrant tous les pods "Running"

3. **Services**
```bash
kubectl get services -n vigilance-france
```
→ Capture d'écran

4. **Dashboard Minikube**
```bash
minikube dashboard
```
→ Capture d'écran du dashboard avec les deployments

5. **Application fonctionnelle**
→ Capture d'écran de l'application dans le navigateur

6. **Logs d'un microservice**
```bash
kubectl logs deployment/auth-service -n vigilance-france --tail=50
```
→ Capture d'écran

7. **Détails d'un deployment**
```bash
kubectl describe deployment auth-service -n vigilance-france
```
→ Capture d'écran

8. **ConfigMap et Secrets**
```bash
kubectl get configmap,secret -n vigilance-france
```
→ Capture d'écran

## 📝 POUR LE README PRINCIPAL

Ajoutez cette section à votre README.md principal:

```markdown
## 🚀 Déploiement Kubernetes

Ce projet peut être déployé sur un cluster Kubernetes avec Minikube.

### Prérequis

- Minikube (v1.30+)
- kubectl (v1.27+)
- Docker (v20.10+)
- 4 CPU cores
- 8 GB RAM

### Déploiement rapide

\`\`\`bash
# Démarrer Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

# Déployer l'application
./k8s/deploy.sh

# Accéder à l'application
minikube service frontend-service -n vigilance-france
\`\`\`

### Documentation complète

Consultez [k8s/README.md](./k8s/README.md) pour la documentation complète du déploiement Kubernetes.

### Architecture Kubernetes

- **Namespace**: vigilance-france
- **Databases**: MongoDB + Redis (avec volumes persistants)
- **Microservices**: 4 services (auth, maps, messages, notifications)
- **API Gateway**: Reverse proxy avec rate limiting
- **Frontend**: Application React
- **Replicas**: 2 instances par microservice (haute disponibilité)
- **Ingress**: Routage HTTP avec NGINX

### Concepts Kubernetes démontrés

✅ Namespaces
✅ ConfigMaps & Secrets
✅ PersistentVolumes & PersistentVolumeClaims
✅ Deployments avec replicas
✅ Services (ClusterIP, NodePort)
✅ Ingress
✅ Liveness & Readiness Probes
✅ Resource Limits & Requests
✅ SessionAffinity (pour WebSocket)
\`\`\`

## 🎓 EXPLICATIONS POUR LE PROFESSEUR

### Pourquoi Kubernetes?

1. **Scalabilité**: 2 replicas par microservice pour la haute disponibilité
2. **Isolation**: Namespace dédié pour séparer les ressources
3. **Configuration**: ConfigMaps et Secrets pour la gestion de la config
4. **Stockage**: PersistentVolumes pour MongoDB et Redis
5. **Networking**: Services ClusterIP pour communication interne
6. **Exposition**: Ingress pour le routage HTTP
7. **Monitoring**: Probes pour la santé des pods
8. **Ressources**: Limits et Requests pour optimiser l'utilisation

### Concepts avancés utilisés:

- **SessionAffinity**: Pour les WebSockets (mess-service)
- **Probes**: Health checks automatiques
- **Multi-replicas**: Tolérance aux pannes
- **PersistentVolumes**: Données persistantes même après redémarrage
- **Ingress**: Reverse proxy Kubernetes-native
- **Secrets**: Gestion sécurisée des credentials

## 🐛 TROUBLESHOOTING

### Problème: Pods bloqués en "Pending"

```bash
# Vérifier les ressources
kubectl describe nodes

# Voir les événements
kubectl get events -n vigilance-france --sort-by='.lastTimestamp'

# Solution: Augmenter les ressources Minikube
minikube stop
minikube start --cpus=6 --memory=12288 --driver=docker
```

### Problème: "ImagePullBackOff"

```bash
# Utiliser le Docker daemon de Minikube
eval $(minikube docker-env)

# Re-build les images
docker build -t vigilance/auth-service:latest ./backend/microservices/auth-service
# etc...

# Redéployer
kubectl rollout restart deployment -n vigilance-france
```

### Problème: Pods en "CrashLoopBackOff"

```bash
# Voir les logs
kubectl logs <pod-name> -n vigilance-france

# Voir les événements
kubectl describe pod <pod-name> -n vigilance-france

# Souvent: problème de connexion à MongoDB ou Redis
# Vérifier que les DBs sont prêtes:
kubectl get pods -n vigilance-france | grep -E "mongodb|redis"
```

## 🗑️ NETTOYAGE

### Supprimer le déploiement

```bash
./k8s/cleanup.sh
```

### Arrêter Minikube

```bash
minikube stop
```

### Supprimer complètement

```bash
minikube delete
```

## ✅ CHECKLIST FINALE AVANT LE RENDU

- [ ] Minikube installé et fonctionnel
- [ ] Tous les fichiers K8s créés dans `/k8s/`
- [ ] `./k8s/deploy.sh` fonctionne sans erreur
- [ ] Tous les pods sont "Running"
- [ ] Application accessible dans le navigateur
- [ ] Captures d'écran prises (au moins 5-6)
- [ ] README principal mis à jour avec section Kubernetes
- [ ] Fichiers K8s commités dans Git
- [ ] Documentation testée par un collègue (si possible)

## 📞 COMMANDES UTILES POUR LA DÉMO

```bash
# Voir tout
kubectl get all -n vigilance-france

# Dashboard
minikube dashboard

# Ouvrir l'app
minikube service frontend-service -n vigilance-france

# Logs en temps réel
kubectl logs -f deployment/api-gateway -n vigilance-france

# Scaler
kubectl scale deployment auth-service --replicas=3 -n vigilance-france

# État du cluster
kubectl top nodes
kubectl top pods -n vigilance-france
```

---

**TOUT EST PRÊT! 🎉**

Il ne vous reste plus qu'à:
1. Exécuter `./k8s/deploy.sh`
2. Prendre les captures d'écran
3. Mettre à jour le README principal
4. Commit & Push

Bonne chance pour votre rendu! 🚀
